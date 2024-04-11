const router = require('express').Router();
const User = require('../models/user');
const bycrypt = require('bcrypt');
const {jwtDecode} = require('jwt-decode');
const {authenthicateJwtToken, generateRefreshToken, generateAccessToken, generatePasswordResetToken, verifyTokenCode} = require('../services/jwtService');
const {sendEmailCode: sendEmailLink} = require('../services/emailService');
const DeactivatedUser = require('../models/deactivatedUser');
const ProfileIcons = require('../Enums/ProfileIcons');
const Voices = require('../Enums/Voices');
const TokenType = require('../Enums/TokenType');
const ValidationToken = require('../models/ValidationToken');

router.post('/user/refreshtoken', async (req, res) => {
  try {
    const currentAccessToken = req.body.token;
    const currentJwtUser = jwtDecode(currentAccessToken);
    const refreshTokenReponse = await ValidationToken.findOne({email: currentJwtUser
        .email});

    jwt.verify(refreshTokenReponse.token, process.env.JWT_SECRET, async (err) => {
      if (err || !refreshTokenReponse.valid) {
        res.sendStatus(401);
      } else {
        const userData = await User.findById(currentJwtUser._id);
        const userJwt = {_id: userData._id, email: userData.email};
        const accessToken = generateAccessToken(userJwt);
        res.status(200).send(accessToken);
      }
    });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({email: req.body.email, isBlocked: false}, {lastLogin: Date.now()});
    if (user) {
      const validPassword = await bycrypt.compare(req.body.password, user.password);
      if (validPassword) {
        const userJwt = {_id: user._id, email: user.email};
        const accessToken = generateAccessToken(userJwt);
        await ValidationToken.findOneAndUpdate({email: user.email}, {email: user.email, token: generateRefreshToken(userJwt), type: TokenType.REFRESH, valid: true}, {upsert: true});
        res.status(200).send(accessToken);
      } else {
        res.status(401).send('Invalid Credentials.');
      }
    } else {
      res.status(401).send('Invalid Credentials.');
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.post('/user/autoLogin', authenthicateJwtToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({email: req.body.email, isBlocked: false}, {lastLogin: Date.now()});
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.get('/user/id/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id.trim());
    res.status(200).send(user);
  } catch (error) {
    res.status(204).send(error);
    console.log(error);
  }
});

router.get('/user/email/:email', async (req, res) => {
  try {
    const user = await User.findOne( {email: req.params.email.trim()});
    res.status(200).send(user);
  } catch (error) {
    res.status(204).send(error);
    console.log(error);
  }
});

// Find list of emails that contains substring :email
router.get('/users/email/:email', authenthicateJwtToken, async (req, res) => {
  try {
    const regex = new RegExp(req.params.email.trim(), 'i');
    const user = await User.find( {email: {'$regex': regex}});
    res.status(200).send(user);
  } catch (error) {
    res.status(204).send(error);
    console.log(error);
  }
});

// Find list of users that contains substring :name
router.get('/users/name/:name', async (req, res) => {
  try {
    const regex = new RegExp(req.params.name.trim(), 'i');
    const user = await User.find( {name: {'$regex': regex}});
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(204).send(error);
  }
});

router.get('/users/newest', async (req, res) => {
  try {
    const users = await User.find({}).limit(5).sort({createdAt: -1});
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get('/users/recent', async (req, res) => {
  try {
    const users = await User.find({}).limit(5).sort({lastLogin: -1});
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post('/user/add', async (req, res) => {
  const randomDefaultIcon =()=>{
    const keys = Object.keys(ProfileIcons);
    return ProfileIcons[keys[keys.length * Math.random() << 0]];
  };
  try {
    const hash = await bycrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      settings: {icon: randomDefaultIcon(),
        voiceSelection: Voices.OLIVIA.alt,
      },
    });
    // For faster temp testing, remove later
    if (user.email.toLowerCase() === process.env.GMAIL_SENDER_ACCOUNT) {
      user.isAdmin = true;
    }
    const newUser = await user.save();
    const userJwt = {_id: newUser._id, email: newUser.email};
    const accessToken = generateAccessToken(userJwt);
    const refreshToken = new RefreshToken({userId: userJwt._id, token: generateRefreshToken(userJwt)});
    await refreshToken.save();
    res.status(200).send(accessToken);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.put('/user/update', authenthicateJwtToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.body.userData._id, req.body.userData, {new: true});
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});


router.put('/user/update-password', authenthicateJwtToken, async (req, res) => {
  try {
    const user = await User.findById(req.body.userData._id);
    const validPassword = await bycrypt.compare(req.body.userData.currentPassword, user.password);

    if (validPassword) {
      const newPasswordUser = user;
      newPasswordUser.password = await bycrypt.hash(req.body.userData.newPassword, 10);
      const updatedUser = await User.findByIdAndUpdate(req.body.userData._id, newPasswordUser, {new: true});
      res.status(200).send(updatedUser);
    } else {
      res.status(204).send('Invalid current password');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete('/user/delete/:id', authenthicateJwtToken, async (req, res) => {// admin use only
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send('User Deleted.');
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete('/user/deactivate/:id/:deletePassword', authenthicateJwtToken, async (req, res) => { // delete user
  try {
    const user = await User.findById(req.params.id);
    const validPassword = await bycrypt.compare(req.params.deletePassword, user.password);
    if (validPassword) {
      const deactivatedUser = new DeactivatedUser({
        user: user,
      });
      await deactivatedUser.save();
      await User.findByIdAndDelete(user._id);
      res.status(200).send('User deactivated.');
    } else {
      res.status(204).send('Invalid password.');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});


router.post('/user/reset/request', async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      const userJwt = {_id: user._id, email: user.email};
      const resetPasswordToken = new ValidationToken({email: userJwt.email, token: generatePasswordResetToken(userJwt), valid: true, type: TokenType.RESET});
      await resetPasswordToken.save();
      sendEmailLink(req.body.email, resetPasswordToken.token, req.body.siteBaseUrl);
      res.status(200).send('Email sent if account exists.');
    } else {
      res.status(200).send('Email sent if account exists.');// Do i need this?
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get('/user/reset/check/:resetToken', async (req, res) => {
  try {
    const resetPasswordToken = await ValidationToken.findOne({token: req.params.resetToken, type: TokenType.RESET, valid: true});
    if (resetPasswordToken) {
      res.status(200).send(resetPasswordToken);
    } else {
      res.status(204).send('Reset link expired or does not exist.');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post('/user/reset/verify', authenthicateJwtToken, async (req, res) => {
  try {
    const resetPasswordToken = await ValidationToken.findOne({token: req.body.token});
    if (!resetPasswordToken || resetPasswordToken.email !== req.body.email) {
      res.status(500).send('Requested email and submitted email do not match.');
    } else {
      const verificationResponse = verifyTokenCode(resetPasswordToken.token);
      if (verificationResponse) {
        const invalidateResetPasswordToken = {email: resetPasswordToken.email, token: resetPasswordToken.token, valid: false, type: TokenType.RESET};
        await ValidationToken.findByIdAndUpdate(resetPasswordToken._id, invalidateResetPasswordToken);
        await User.findOneAndUpdate({email: resetPasswordToken.email}, {password: await bycrypt.hash(req.body.newPassword, 10)});
        res.status(200).send('Password reset successful.');
      } else {
        res.status(204).send('Password reset request expired or does not exist.');
      }
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

module.exports = router;
