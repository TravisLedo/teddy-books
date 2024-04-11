const mongoose = require('mongoose');

const validationTokenSchema = mongoose.Schema({
  token: {type: String, required: true},
  email: {type: String, required: true},
  type: {type: String, required: true},
  valid: {type: Boolean, required: true},
}, {timestamps: true});

module.exports = mongoose.model('ValidationToken', validationTokenSchema);
