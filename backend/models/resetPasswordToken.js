const mongoose = require('mongoose');

const resetPasswordTokenSchema = mongoose.Schema({
  token: {type: String, required: true},
  email: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model('ResetPasswordToken', resetPasswordTokenSchema);
