const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: {type: String, required: false},
  file: {type: String, required: false},
  author: {type: String, required: false},
  text: {type: String},
  views: {type: Number, required: true, default: 0},
  likes: [{type: String}],
}, {timestamps: true},
);

module.exports = mongoose.model('Book', bookSchema);
