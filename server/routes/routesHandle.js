const passport = require('passport');
const ensureAuthenticated = require('../lib/ensureAuthenticated');
const ClassDBController = require('../database/dbController');
const authRoutes = require('../api/auth');
const apiRoutes = require('../api/api');
const config = require('../config/config');

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
      const DBController = new ClassDBController();

      DBController.getUserByTelegramId(req.user.id)
        .then(user => {
          if (user === null || (Array.isArray(user) && user.length === 0)) {
            DBController.postNewUser({
              telegramUserId: req.user.id,
              firstName: req.user.first_name,
              lastName: req.user.last_name,
              username: req.user.username,
              avatar: req.user.avatar
            })
              .then(newUser => {
                res.redirect(
                  303,
                  `${config.frontendServer}/id/${newUser.telegramUserId}`
                );
              })
              .catch(err => {
                res.redirect(`${config.frontendServer}/error`);
              });
          } else {
            res.redirect(
              303,
              `${config.frontendServer}/id/${user.telegramUserId}`
            );
          }
        })
        .catch(err => {
          res.send(err);
        });
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
