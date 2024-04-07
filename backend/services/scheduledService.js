const schedule = require('node-schedule');
const fs = require('fs');
const ResetPasswordToken = require('../models/resetPasswordToken');
const RefreshToken = require('../models/refreshToken');

// Every minute
const deleteOldAudioFilesJob = schedule.scheduleJob('*/1 * * * *', function() {
  console.log('Scheduled Job: Delete Old Audio Files.');
  // deleteOldAudioFiles('./public/temp');
});

// Every minute
schedule.scheduleJob('*/1 * * * *', function() {
  // deleteOldAudioFiles('./public/temp');
});

// Every minute
schedule.scheduleJob('*/1 * * * *', function() {
  // deleteOldAudioFiles('./public/temp');
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
async function deleteExpiredRefreshTokens(path) {
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

module.exports = {deleteOldAudioFilesJob};
