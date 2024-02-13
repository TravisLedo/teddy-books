const mongoose = require('mongoose');

const blockedEmailSchema = mongoose.Schema({
  email: {type: String, required: true},
});

module.exports = mongoose.model('BlockedEmail', blockedEmailSchema);
