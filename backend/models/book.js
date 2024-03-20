const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: {type: String, required: false},
  folder: {type: String, required: false},
  author: {type: String, required: false},
  pages: {type: Number, required: false},
  text: {type: String},
}, {timestamps: true},
);

module.exports = mongoose.model('Book', bookSchema);
