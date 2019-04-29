const { Strategy } = require('passport-telegram');
const config = require('../config/config.json');
const fetch = require('isomorphic-unfetch');
const port = process.env.PORT || 3000;

const telegramStrategy = new Strategy(
  config.telegramAuth,
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      done(null, profile);
    });
  }
);

module.exports = telegramStrategy;
