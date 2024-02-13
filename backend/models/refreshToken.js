const mongoose = require('mongoose');

const refreshTokenSchema = mongoose.Schema({
  token: {type: String, required: true},
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
