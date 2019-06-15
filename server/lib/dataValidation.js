const checkSignature = require('./checkTelegramSignature');

function dataValidation(req, res, next) {
  const user = req.body;

  if (!checkSignature(user)) {
    return res.status(401).send('Data is NOT from Telegram');
  }

  if (+new Date() / 1000 - user.auth_date > 86400) {
    return res.status(401).send('Data is outdated');
  }
  delete user.hash;

  return next();
}

module.exports = dataValidation;
