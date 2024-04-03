const mongoose = require('mongoose');

// For historic stats data
const deactivatedUserSchema = mongoose.Schema({
  user: {type: Object},
});

module.exports = mongoose.model('DeactivatedUser', deactivatedUserSchema);
