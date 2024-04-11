const schedule = require('node-schedule');
const fs = require('fs');
const ValidationToken = require('../models/ValidationToken');
const {verifyTokenCode} = require('./jwtService');

const hourlyScheduledJobs = schedule.scheduleJob('0 * * * *', function() {
  deleteOldAudioFiles('./public/temp');
  deleteExpiredValidationTokens();
});


// Remove any audio files that may be missed due to interuptions from auto delete.
// Files older than 1 minute will be removed.
async function deleteOldAudioFiles(path) {
  try {
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
      const fileDate = new Date(fs.statSync(path + '/' + dirent.name).birthtime);
      const oneMinute = 1000 * 60 * 1;
      const anHourAgo = Date.now() - oneMinute;

      if (fileDate < anHourAgo) {
        fs.unlink(path + '/' + dirent.name, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// Remove any refreshTokens from db if expired
async function deleteExpiredValidationTokens() {
  try {
    const tokens = await ValidationToken.find();
    tokens.forEach(async (tokenObject) => {
      const stillValid = verifyTokenCode(tokenObject.token);
      if (!stillValid || !tokenObject.valid) {
        await ValidationToken.findByIdAndDelete(tokenObject._id);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {hourlyScheduledJobs};
