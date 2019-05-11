const passport = require('passport');
const ensureAuthenticated = require('../lib/ensureAuthenticated');
const User = require('../database/models/user');
const authRoutes = require('../api/auth');
const apiRoutes = require('../api/api');

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
          id_telegram: req.user.id
        },
        {
          $set: {
            id_telegram: req.user.id,
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
          return 42;
        }
      );
    }
  );

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.use('/api', apiRoutes);
  app.use('/api/auth', authRoutes);
};

module.exports = routesHandle;
