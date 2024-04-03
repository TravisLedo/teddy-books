const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: {type: String, required: false},
  folder: {type: String, required: false},
  author: {type: String, required: false},
  pages: {type: Number, required: false},
  text: {type: String},
  views: {type: Number, required: true, default: 0},
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
}, {timestamps: true},
);

module.exports = mongoose.model('Book', bookSchema);
