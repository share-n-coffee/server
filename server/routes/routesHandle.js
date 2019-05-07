const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const ensureAuthenticated = require('../lib/ensureAuthenticated');
const User = require('../database/models/user');

const routesHandle = app => {
  app.get('/user', ensureAuthenticated, (req, res) => {
    res.send({
      user: req.user
    });
  });

  app.get('/', (req, res) => {
    res.render('index', {
      user: req.user,
      errors: false
    });
  });

  app.get('/failed', (req, res) => {
    res.render('index', {
      user: req.user,
      errors: true
    });
  });

  app.get(
    '/auth/telegram',
    passport.authenticate('telegram'),
    (req, res) => {}
  );

  app.get(
    '/auth/telegram/callback',
    passport.authenticate('telegram', {
      failureRedirect: '/failed'
    }),
    (req, res) => {
      User.findOneAndUpdate(
        {
          id: req.user.id
        },
        {
          $set: {
            id: req.user.id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            username: req.user.username,
            avatar: req.user.avatar
          }
        },
        {
          _id: -1,
          upsert: true
        },
        (err, result) => {
          if (err) return res.send(err);
          res.redirect('/');
        }
      );
    }
  );

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  //  process request to API
  app.use('/api', require('../api/api'));
};

module.exports = routesHandle;
