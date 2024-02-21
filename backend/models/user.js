const mongoose = require('mongoose');
const Voices = require('../Enums/Voices');

const userSchema = mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  isAdmin: {type: Boolean, default: false},
  isBlocked: {type: Boolean, default: false},
  dateCreated: {type: Date, default: false},
  dateModified: {type: Boolean, default: false},
  settings: {
    autoNextPage: {type: Boolean, default: true},
    audioEnabled: {type: Boolean, default: true},
    voiceSelection: {type: String, default: Voices.JOE.voice},
  }});

module.exports = mongoose.model('User', userSchema);
