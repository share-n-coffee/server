const { Strategy } = require('passport-telegram');
const config = require('../config/config');
const fetch = require('isomorphic-unfetch');
console.log(config.telegramAuth);
const telegramStrategy = new Strategy(
  config.telegramAuth,
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      done(null, profile);
    });
  }
);

module.exports = telegramStrategy;
