const router = require('express').Router();
const Book = require('../models/book');
const {authenthicateJwtToken} = require('../services/jwtService');
const https = require('https');
const fs = require('fs');
const PDFParser = require('pdf2json');
const pdfParser = new PDFParser();
const {v4: uuidv4} = require('uuid');


router.get('/books/all', async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.get('/book/id/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});


router.get('/book/title/:title', async (req, res) => {
  try {
    const book = await Book.findOne({title: req.params.title.trim()});
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.delete('/book/delete/:id', authenthicateJwtToken, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).send('Book Deleted.');
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.post('/book/add', authenthicateJwtToken, async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      folder: generateFolderNameFromTitle(req.body.title), // generate this
      author: req.body.author,
      text: req.body.text,
    });
    await book.save();
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.put('/book/update', authenthicateJwtToken, async (req, res) => {
  try {
    const newBookValues = {
      title: req.body.bookData.title,
      folder: generateFolderNameFromTitle(req.body.bookData.title),
      author: req.body.bookData.author,
      text: req.body.bookData.text,
      likes: req.body.bookData.likes,
      views: req.body.bookData.views,
    };
    const updatedBook = await Book.findByIdAndUpdate(req.body.bookData._id, newBookValues, {new: true});
    res.status(200).send(updatedBook);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.get('/book/generate/:title', authenthicateJwtToken, async (req, res) => {
  try {
    const formattedText = await getPDFText(generateFolderNameFromTitle(req.params.title));
    res.status(200).send(formattedText);
  } catch (error) {
    res.status(500).send('Could not generate texts');
  }
});

const generateFolderNameFromTitle = (title) => {
  return title.trim().replaceAll(' ', '_').toLowerCase();
};

const getPDFText= async (book)=>{
  return new Promise((resolve, reject) => {
    let formatedString = '';
    const FILE_NAME = Date.now().toString() + '_' + uuidv4() + '.pdf';
    const file = fs.createWriteStream('./public/temp/' + FILE_NAME);
    https.get(process.env.BOOKS_BASE_URL + '%2F' + book + '.pdf?alt=media&token=' + process.env.FIREBASE_TOKEN, function(response) {
      response.pipe(file);

      file.on('finish', async () => {
        file.close();
        pdfParser.loadPDF('./public/temp/' + FILE_NAME);

        await pdfParser.on('pdfParser_dataError', (errData) => reject(errData.parserError));
        await pdfParser.on('pdfParser_dataReady', (pdfData) => {
          const pages = pdfData.Pages;
          const finalMap = new Map();

          for (const [key, value] of Object.entries(pages)) {
            const page = value;
            const pageKey = key;
            finalMap.set(pageKey, '');

            for (const [key, value] of Object.entries(page)) {
              const texts = value;
              for (const [key, value] of Object.entries(texts)) {
                const text = value;
                for (const [key, value] of Object.entries(text)) {
                  const r = value;
                  for (const [key, value] of Object.entries(r)) {
                    const line = value.T;
                    const pageExists = finalMap.has(pageKey);
                    if (line !== undefined && pageExists) {
                      const existingValue = finalMap.get(pageKey);
                      finalMap.set(pageKey, existingValue.concat(' ' + decodeURIComponent(line)));
                    }
                  }
                }
              }
            }
          }
          for (const [key, value] of finalMap) {
            const pageNumber = parseInt(key) + 1;
            formatedString += '{{' + pageNumber + '}}' + ' ' + value + '\n';
          }
          resolve(formatedString);
        });
      });
    }).on('error', (err) => reject(err));
  });
};

module.exports = router;
