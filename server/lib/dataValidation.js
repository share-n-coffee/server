const jwt = require('jsonwebtoken');
const checkSignature = require('./checkTelegramSignature');
const config = require('../config/config');

async function dataValidation(req, res, next) {
  const { user } = req;
  if (!checkSignature(user)) {
    return res.status(401).send('Data is NOT from Telegram');
  }
  if (+new Date() - user.auth_date > 86400) {
    return res.status(401).send('Data is outdated');
  }
  delete user.hash;

  const token = await jwt.sign(user, config.jwtSecret);
  user.token = token;
  req.user = user;
  return next();
}

module.exports = dataValidation;
