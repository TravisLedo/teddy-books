const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: { type: String, required: false },
  folder: { type: String, required: false },
  author: { type: String, required: false },
  pages: { type: Number, required: false },
  texts: [{ page: { type: Number }, text: { type: String } }],
});

module.exports = mongoose.model("Book", bookSchema);
