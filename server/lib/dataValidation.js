const checkSignature = require('./checkTelegramSignature');
const { dataAuthExpirationTimeLimit } = require('../config/config');

function dataValidation(req, res, next) {
  const user = req.body;

  if (!checkSignature(user)) {
    return res.status(401).send('Data is NOT from Telegram');
  }

  // need to divide timestamp because telegram send it with 10 digit precision
  if (+new Date() / 1000 - user.auth_date > dataAuthExpirationTimeLimit) {
    return res.status(401).send('Data is outdated');
  }
  delete user.hash;

  return next();
}

module.exports = dataValidation;
