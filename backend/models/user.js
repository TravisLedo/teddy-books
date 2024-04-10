const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  isAdmin: {type: Boolean, default: false},
  isBlocked: {type: Boolean, default: false},
  lastLogin: {type: Date, required: false},
  settings: {
    autoNextPage: {type: Boolean, default: true},
    audioEnabled: {type: Boolean, default: true},
    voiceSelection: {type: String, required: true},
    icon: {type: String, required: true},
  }}, {timestamps: true},
);


module.exports = mongoose.model('User', userSchema);
