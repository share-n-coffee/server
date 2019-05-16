const ClassDBController = require('../database/dbController');
const authRoutes = require('../api/auth');
const apiRoutes = require('../api/api');
const config = require('../config/config');
const checkSignature = require('../lib/checkTelegramSignature');
const jwtAuth = require('../middleware/jwtAuth');

const routesHandle = app => {
  app.get('/', (req, res) => {
    res.render('index', {
      user: req.user,
      errors: false
    });
  });

  app.get('/auth/telegram/callback', (req, res) => {
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
            `${config.frontendServer}/?id=${user.telegramUserId}`
          );
        }
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.use('/api', jwtAuth, apiRoutes);
  app.use('/api/auth', authRoutes);

  app.use((req, res) => {
    res.render('404');
  });
};

module.exports = routesHandle;
