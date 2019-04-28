const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const ensureAuthenticated = require('../lib/ensureAuthenticated');
const User = require('../models/user');

const routesHandle = app => {
  app.get('/', (req, res) => {
    User.find().then(user => res.json(user));
  });
};

module.exports = routesHandle;
