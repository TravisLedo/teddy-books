const jwt = require('jsonwebtoken');


function generateAccessToken(userJwt) {
  return jwt.sign(userJwt, process.env.JWT_SECRET, {expiresIn: '10m'});
}


function generateRefreshToken(jwtValues) {
  return jwt.sign(jwtValues, process.env.JWT_SECRET, {expiresIn: '20m'});
}

function generatePasswordResetToken(jwtValues) {
  return jwt.sign(jwtValues, process.env.JWT_SECRET, {expiresIn: '10m'});
}

// middleware
function authenthicateJwtToken(req, res, next ) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}

const verifyResetPasswordTokenCode = (token)=>{
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};


module.exports = {generateAccessToken, generateRefreshToken, generatePasswordResetToken, authenthicateJwtToken, verifyResetPasswordTokenCode};
