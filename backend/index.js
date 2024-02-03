const port = 3001;
const Book = require("./models/book");
const mongoose = require("mongoose");
const express = require("express");
const schedule = require("node-schedule");
const fs = require("fs");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

var cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
require("dotenv").config();

app.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Connected to Database.");
  })
  .catch((e) => console.log(e));

app.get("/books/all", async (req, res) => {
  console.log("Fetching all books data.");
  try {
    const books = await Book.find({});
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/books/:id", async (req, res) => {
  console.log("Fetching book data by id " + req.params.id + ".");
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/books/add", async (req, res) => {
  console.log("Adding new book to database.");
  try {
    const book = new Book({
      title: req.body.title,
      folder: req.body.folder,
      author: req.body.author,
      pages: req.body.pages,
      texts: req.body.texts,
    });
    await book.save();

    res.status(200).send(book);
  } catch (error) {
    console.log(error);

    res.status(500).send(error);
  }
});

app.post("/books/witai/speak", async (req, res) => {
  const config = {
    headers: {
      Authorization: `Bearer ${process.env.WIT_AI_TOKEN}`,
      Accept: "audio/mpeg",
    },
    responseType: "stream",
  };

  console.log(req.body.leftPage + ", " + req.body.rightPage);
  try {
    const leftPageText = req.body.book.texts.find(
      (obj) => obj.page == req.body.leftPage
    );

    const rightPageText = req.body.book.texts.find(
      (obj) => obj.page == req.body.rightPage
    );

    let finalText = null;

    if (leftPageText && rightPageText) {
      finalText = leftPageText.text + " " + rightPageText.text;
    } else if (leftPageText && !rightPageText) {
      finalText = leftPageText.text;
    } else if (!leftPageText && rightPageText) {
      finalText = rightPageText.text;
    }

    if (finalText) {
      const DIR_PATH = "./public/";
      const FILE_NAME = Date.now().toString() + "_" + uuidv4() + ".mp3";
      const FILE_PATH = DIR_PATH + FILE_NAME;

      let response = await axios.post(
        "https://api.wit.ai/synthesize",
        {
          q: finalText,
          voice: req.body.voiceSelected,
          style: "soft",
          speed: 100,
          // pitch: 110,
        },
        config
      );

      let stream = fs.createWriteStream(FILE_PATH);
      response.data.pipe(stream).on("finish", function done() {
        console.log("Saved audio to " + FILE_PATH);
        res.status(200).send(FILE_NAME);
      });
    } else {
      res.status(200).send("Page has no audio.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

schedule.scheduleJob("*/1 * * * *", function () {
  console.log("clearing old files.");
  deleteOldFiles("./public").catch(console.error);
});

//todo: instead of delete by time, maybe have the frontend send a message with the file name once it was able to load and that triggers a delete
async function deleteOldFiles(path) {
  const dir = await fs.promises.opendir(path);
  for await (const dirent of dir) {
    const fileDate = new Date(fs.statSync(path + "/" + dirent.name).birthtime);
    const fiveMinutes = 1000 * 60 * 5;
    const anHourAgo = Date.now() - fiveMinutes;

    if (fileDate < anHourAgo) {
      fs.unlink(path + "/" + dirent.name, (err) => {
        if (err) {
          throw err;
        }
        //console.log("Deleted file successfully.");
      });
    } else {
      //console.log("File is still new.");
    }
  }
}
