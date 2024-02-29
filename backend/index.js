const port = 3001;
const Book = require('./models/book');
const User = require('./models/user');
const RefreshToken = require('./models/refreshToken');
const mongoose = require('mongoose');
const express = require('express');
const schedule = require('node-schedule');
const fs = require('fs');
const axios = require('axios');
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
require('dotenv').config();
const bycrypt = require('bcrypt');
const {jwtDecode} = require('jwt-decode');

app.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});

mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log('Connected to Database.');
    })
    .catch((e) => console.log(e));


app.post('/token/refresh', async (req, res) => {
  try {
    const currentAccessToken = req.body.token;
    const currentJwtUser = jwtDecode(currentAccessToken);
    const refreshTokenReponse = await RefreshToken.findOne({userId: currentJwtUser
        ._id});

    jwt.verify(refreshTokenReponse.token, process.env.JWT_SECRET, async (err) => {
      if (err) {
        console.log('Refresh token expired for ' + currentAccessToken._id + '(' +currentAccessToken.email + ')' + ', user needs to login again.');
        res.sendStatus(401);
      } else {
        const userData = await User.findById(currentJwtUser._id);
        const userJwt = {_id: userData._id, email: userData.email};
        const accessToken = generateAccessToken(userJwt);
        res.status(200).send(accessToken);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});


app.get('/books/all', async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).send(books);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).send(book);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.delete('/books/delete/:id', authenthicateJwtToken, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).send('Book Deleted.');
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post('/books/add', authenthicateJwtToken, async (req, res) => {
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
    console.log(error);
    res.status(500).send(error);
  }
});

app.put('/books/update', authenthicateJwtToken, async (req, res) => {
  try {
    const newBookValues = {
      title: req.body.bookData.title,
      folder: generateFolderNameFromTitle(req.body.bookData.title),
      author: req.body.bookData.author,
      pages: req.body.bookData.pages,
      text: req.body.bookData.text,
    };
    await Book.findByIdAndUpdate(req.body.bookData._id, newBookValues);
    res.status(200).send('Updated book data.');
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post('/books/witai/speak', async (req, res) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.WIT_AI_TOKEN}`,
        Accept: 'audio/mpeg',
      },
      responseType: 'stream',
    };

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
    // console.log(error);
    res.status(500).send(error);
  }
});

app.post('/books/removeaudio', async (req, res) => {
  try {
    const DIR_PATH = './public';
    if (req.body.file.contains('temp')) {
      fs.unlink(DIR_PATH + '/' + req.body.file, (err) => {
        if (err) {
        // throw err;
        }
      });
      res.status(200).send('Temp fie removed');
    }
  } catch (error) {
    // console.log(error);
    res.status(201).send(error);
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({email: req.body.email, isBlocked: false}, {lastLogin: Date.now()});
    const validPassword = await bycrypt.compare(req.body.password, user.password);
    if (validPassword) {
      const userJwt = {_id: user._id, email: user.email};
      const accessToken = generateAccessToken(userJwt);
      await RefreshToken.findOneAndUpdate({userId: user._id}, {userId: user._id, token: generateRefreshToken(userJwt)}, {upsert: true});
      res.status(200).send(accessToken);
    } else {
      res.status(401).send('Login Failed.');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post('/users/autoLogin', authenthicateJwtToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({email: req.body.email, isBlocked: false}, {lastLogin: Date.now()});
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get('/users/id/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get('/users/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({email: req.params.email});
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get('/users/newest', async (req, res) => {
  try {
    const users = await User.find({}).limit(5).sort({createdAt: -1});
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get('/users/recent', async (req, res) => {
  try {
    const users = await User.find({}).limit(5).sort({lastLogin: -1});
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post('/users/add', async (req, res) => {
  try {
    const hash = await bycrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    });
    const newUser = await user.save();
    const userJwt = {_id: newUser._id, email: newUser.email};
    const accessToken = generateAccessToken(userJwt);
    const refreshToken = new RefreshToken({userId: userJwt._id, token: generateRefreshToken(userJwt)});
    await refreshToken.save(refreshToken);
    res.status(200).send(accessToken);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.put('/users/update', authenthicateJwtToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.body.userData._id, req.body.userData, {new: true});
    res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});


// Remove any files that may be missed due to interuptions from auto delete.
// Files older than 1 minute will be removed.
// Check runs every minute
schedule.scheduleJob('*/1 * * * *', function() {
  deleteOldFiles('./public/temp');
});

async function deleteOldFiles(path) {
  try {
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
      const fileDate = new Date(fs.statSync(path + '/' + dirent.name).birthtime);
      const oneMinute = 1000 * 60 * 1;
      const anHourAgo = Date.now() - oneMinute;

      if (fileDate < anHourAgo) {
        fs.unlink(path + '/' + dirent.name, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
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

function generateAccessToken(userJwt) {
  return jwt.sign(userJwt, process.env.JWT_SECRET, {expiresIn: '10m'});
}


function generateRefreshToken(jwtValues) {
  return jwt.sign(jwtValues, process.env.JWT_SECRET, {expiresIn: '20m'});
}

function authenthicateJwtToken(req, res, next ) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}
