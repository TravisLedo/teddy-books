const router = require('express').Router();
const ResetPasswordToken = require('../models/resetPasswordToken');
const {authenthicateJwtToken} = require('../services/jwtService');


router.get('/books/all', async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/book/id/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get('/book/name/:name', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/book/delete/:id', authenthicateJwtToken, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).send('Book Deleted.');
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/book/add', authenthicateJwtToken, async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      file: generateFileNameFromTitle(req.body.title),
      author: req.body.author,
      text: req.body.text,
    });
    await book.save();
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/book/update', authenthicateJwtToken, async (req, res) => {
  try {
    const newBookValues = {
      title: req.body.bookData.title,
      file: generateFileNameFromTitle(req.body.bookData.title),
      author: req.body.bookData.author,
      text: req.body.bookData.text,
    };
    await Book.findByIdAndUpdate(req.body.bookData._id, newBookValues);
    res.status(200).send('Updated book data.');
  } catch (error) {
    res.status(500).send(error);
  }
});

const generateFileNameFromTitle = (title) => {
  return title.trim().replaceAll(' ', '_').toLowerCase();
};

module.exports = router;
