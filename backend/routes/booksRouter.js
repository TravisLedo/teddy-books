const router = require('express').Router();
const Book = require('../models/book');
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


router.get('/book/title/:title', async (req, res) => {
  try {
    const book = await Book.findOne({title: req.params.title.trim()});
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

router.put('/book/update', authenthicateJwtToken, async (req, res) => {
  try {
    const newBookValues = {
      title: req.body.bookData.title,
      folder: generateFolderNameFromTitle(req.body.bookData.title),
      author: req.body.bookData.author,
      pages: req.body.bookData.pages,
      text: req.body.bookData.text,
      likes: req.body.bookData.likes,
      views: req.body.bookData.views,
    };
    const updatedBook = await Book.findByIdAndUpdate(req.body.bookData._id, newBookValues, {new: true});
    res.status(200).send(updatedBook);
  } catch (error) {
    res.status(500).send(error);
  }
});

const generateFolderNameFromTitle = (title) => {
  return title.trim().replaceAll(' ', '_').toLowerCase();
};

module.exports = router;
