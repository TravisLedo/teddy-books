const router = require('express').Router();
const axios = require('axios');
//const schedule = require('node-schedule');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');

router.post('/witai/speak', async (req, res) => {
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
    console.log(error);
    res.status(500).send(error);
  }
});

router.post('/witai/removeaudio', async (req, res) => {
  try {
    const DIR_PATH = './public';
    if (req.body.file.contains('temp')) {
      fs.unlink(DIR_PATH + '/' + req.body.file, (err) => {
        if (err) {
          // throw err;
          console.log(err);
        }
      });
      res.status(200).send('Temp fie removed');
    }
  } catch (error) {
    console.log(error);
    res.status(201).send(error);
  }
});

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

module.exports = router;
