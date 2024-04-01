const router = require('express').Router();
const User = require('../models/user');
const bycrypt = require('bcrypt');
const {jwtDecode} = require('jwt-decode');
const {authenthicateJwtToken, generateRefreshToken, generateAccessToken, generatePasswordResetToken, verifyResetPasswordTokenCode} = require('../services/jwtService');
const ResetPasswordToken = require('../models/resetPasswordToken');
const RefreshToken = require('../models/refreshToken');
const {sendEmailCode: sendEmailLink} = require('../services/emailService');

router.post('/user/refreshtoken', async (req, res) => {
  try {
    const currentAccessToken = req.body.token;
    const currentJwtUser = jwtDecode(currentAccessToken);
    const refreshTokenReponse = await RefreshToken.findOne({userId: currentJwtUser
        ._id});

    jwt.verify(refreshTokenReponse.token, process.env.JWT_SECRET, async (err) => {
      if (err) {
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
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({email: req.body.email, isBlocked: false}, {lastLogin: Date.now()});
    const validPassword = await bycrypt.compare(req.body.password, user.password);
    if (validPassword) {
      const userJwt = {_id: user._id, email: user.email};
      const accessToken = generateAccessToken(userJwt);
      await RefreshToken.findOneAndUpdate({userId: user._id}, {userId: user._id, token: generateRefreshToken(userJwt)}, {upsert: true});
      res.status(200).send(accessToken);
    } else {
      res.status(401).send('Login Failed.');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/user/autoLogin', authenthicateJwtToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({email: req.body.email, isBlocked: false}, {lastLogin: Date.now()});
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
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
  }
});

router.get('/users/name/:name', async (req, res) => {
  try {
    const regex = new RegExp(req.params.name.trim(), 'i');
    const user = await User.find( {name: {'$regex': regex}});
    res.status(200).send(user);
  } catch (error) {
    res.status(204).send(error);
  }
});

router.get('/user/name/:name', async (req, res) => {
  try {
    const user = await User.findOne( {name: req.params.name.trim()});
    res.status(200).send(user);
  } catch (error) {
    res.status(204).send(error);
  }
});

router.get('/users/newest', async (req, res) => {
  try {
    const users = await User.find({}).limit(5).sort({createdAt: -1});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/users/recent', async (req, res) => {
  try {
    const users = await User.find({}).limit(5).sort({lastLogin: -1});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/user/add', async (req, res) => {
  try {
    const hash = await bycrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    });
    const newUser = await user.save();
    const userJwt = {_id: newUser._id, email: newUser.email};
    const accessToken = generateAccessToken(userJwt);
    const refreshToken = new RefreshToken({userId: userJwt._id, token: generateRefreshToken(userJwt)});
    await refreshToken.save();
    res.status(200).send(accessToken);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/user/update', authenthicateJwtToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.body.userData._id, req.body.userData, {new: true});
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/user/delete/:id', authenthicateJwtToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send('User Deleted.');
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/user/reset/request', async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      const userJwt = {_id: user._id, email: user.email, password: user.password};
      const resetPasswordToken = new ResetPasswordToken({email: userJwt.email, token: generatePasswordResetToken(userJwt), valid: true});
      await resetPasswordToken.save();
      sendEmailLink(resetPasswordToken.token, req.body.siteBaseUrl);
      res.status(200).send('Email sent if account exists.');
    } else {
      res.status(200).send('Email sent if account exists.');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/user/reset/check/:resetToken', async (req, res) => {
  try {
    const resetPasswordToken = await ResetPasswordToken.findOne({token: req.params.resetToken});
    if (!resetPasswordToken || resetPasswordToken && !resetPasswordToken.valid) {
      res.status(400).send('Reset password link does not exist, expired, or has already been used.');
    } else {
      res.status(200).send('Valid password reset link.');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/user/reset/verify', async (req, res) => {
  try {
    const resetPasswordToken = await ResetPasswordToken.findOne({email: req.body.email}).sort({createdAt: -1});
    if (!resetPasswordToken) {
      res.status(400).send('Requested email and submitted email does not match.');
    } else {
      const verificationResponse = verifyResetPasswordTokenCode(req.body.token);
      if (verificationResponse) {
        const invalidateResetPasswordToken = {email: resetPasswordToken.email, token: resetPasswordToken.token, valid: false};
        const updated = await ResetPasswordToken.findByIdAndUpdate(resetPasswordToken._id, invalidateResetPasswordToken);
        res.status(200).send('Password reset success.' + updated);
      } else {
        res.status(400).send('Email request expired or does not exist');
        console.log('Email request expired or does not exist');
      }
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});


module.exports = router;
