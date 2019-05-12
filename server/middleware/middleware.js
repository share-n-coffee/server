const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const config = require('../config/config');
const telegramStrategy = require('../passport/telegramStrategy');
const passportInitializer = require('../lib/passportInitializer');

module.exports = app => {
  app.use(express.json());
  app.use(express.static('public'));
  app.use(cors(config.corsOptions));
  app.use(
    session({ secret: 'keyboard cat', resave: false, saveUninitialized: false })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  passportInitializer(passport, telegramStrategy);
};
