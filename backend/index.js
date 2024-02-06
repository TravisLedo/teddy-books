const port = 3001;
const Book = require('./models/book');
const mongoose = require('mongoose');
const express = require('express');
const schedule = require('node-schedule');
const fs = require('fs');
const axios = require('axios');
const {v4: uuidv4} = require('uuid');

const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
require('dotenv').config();

app.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});

mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log('Connected to Database.');
    })
    .catch((e) => console.log(e));

app.get('/books/all', async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/books/add', async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      folder: generateFolderNameFromTitle(req.body.title), // generate this
      author: req.body.author,
      pages: req.body.pages,
      text: req.body.text,
    });
    await book.save();
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/books/update', async (req, res) => {
  try {
    const newBookValues = {
      title: req.body.bookData.title,
      folder: generateFolderNameFromTitle(req.body.bookData.title),
      author: req.body.bookData.author,
      pages: req.body.bookData.pages,
      text: req.body.bookData.text,
    };
    await Book.findByIdAndUpdate(req.body.bookData._id, newBookValues);
    res.status(200).send(newBookValues);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/books/witai/speak', async (req, res) => {
  const config = {
    headers: {
      Authorization: `Bearer ${process.env.WIT_AI_TOKEN}`,
      Accept: 'audio/mpeg',
    },
    responseType: 'stream',
  };

  try {
    const finalText =
      parsePageText(req.body.leftPage, req.body.book.text) +
      parsePageText(req.body.rightPage, req.body.book.text);

    if (finalText) {
      const DIR_PATH = './public/temp';
      const FILE_NAME = Date.now().toString() + '_' + uuidv4() + '.mp3';
      const FILE_PATH = DIR_PATH + '/' + FILE_NAME;

      const response = await axios.post(
          'https://api.wit.ai/synthesize',
          {
            q: finalText,
            voice: req.body.voiceSelected,
          // style: "soft",
          // speed: 100,
          // pitch: 110,
          },
          config,
      );

      if (!fs.existsSync(DIR_PATH)) {
        fs.mkdirSync(DIR_PATH);
      }

      const stream = fs.createWriteStream(FILE_PATH);
      response.data.pipe(stream).on('finish', function done() {
        res.status(200).send(FILE_PATH.replace('./public/', ''));
      });
    } else {
      res.status(200).send('empty.mp3');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/books/removeaudio', async (req, res) => {
  const DIR_PATH = './public';
  try {
    if (req.body.file.contains('temp')) {
      fs.unlink(DIR_PATH + '/' + req.body.file, (err) => {
        if (err) {
        // throw err;
        }
      });
      res.status(200).send('Temp fie removed');
    }
  } catch (error) {
    res.status(201).send(error);
  }
});

// Remove any files that may be missed due to interuptions.
// Files older than 1 minute will be removed.
// Check runs every minute
schedule.scheduleJob('*/1 * * * *', function() {
  deleteOldFiles('./public/temp').catch();
});

async function deleteOldFiles(path) {
  const dir = await fs.promises.opendir(path);
  for await (const dirent of dir) {
    const fileDate = new Date(fs.statSync(path + '/' + dirent.name).birthtime);
    const oneMinute = 1000 * 60 * 1;
    const anHourAgo = Date.now() - oneMinute;

    if (fileDate < anHourAgo) {
      fs.unlink(path + '/' + dirent.name, (err) => {
        if (err) {
          throw err;
        }
      });
    }
  }
}

const parsePageText = (page, fullText) => {
  let parsedText;
  const pageText = fullText.split('{{' + page + '}}')[1];
  if (pageText) {
    parsedText = pageText.split('{{')[0];
  } else {
    parsedText = '';
  }
  return parsedText;
};

const generateFolderNameFromTitle = (title) => {
  return title.trim().replaceAll(' ', '_').toLowerCase();
};
