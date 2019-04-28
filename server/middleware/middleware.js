const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const cors = require('cors');
const partials = require('express-partials');
const config = require('../config/config');

module.exports = app => {
  app.use(partials());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors(config.corsOptions));
  app.use(methodOverride());
  app.use(
    session({ secret: 'keyboard cat', resave: false, saveUninitialized: false })
  );
  app.use(passport.initialize());
  app.use(passport.session());
};
