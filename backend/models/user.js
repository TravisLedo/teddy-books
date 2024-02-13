const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  isAdmin: {type: Boolean, default: false},
  settings: {
    autoNextPage: {type: Boolean, default: true},
    audioEnabled: {type: Boolean, default: true},
    audioEnabled: {type: String, default: 'Whimsical'},
  }});

module.exports = mongoose.model('User', userSchema);
