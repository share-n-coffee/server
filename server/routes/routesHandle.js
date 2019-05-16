const ClassDBController = require('../database/dbController');
const authRoutes = require('../api/auth');
const apiRoutes = require('../api/api');
const config = require('../config/config');
const dataValidation = require('../lib/dataValidation');

const routesHandle = app => {
  app.get('/', (req, res) => {
    res.render('index', {
      user: req.user,
      errors: false
    });
  });

  app.put('/auth/telegram/callback', dataValidation, (req, res) => {
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
            .then(() => {
              res.send(req.user.token);
            })
            .catch(err => {
              res.redirect(`${config.frontendServer}/error`);
            });
        } else {
          res.send(req.user.token);
        }
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.use('/api', apiRoutes);
  app.use('/api/auth', authRoutes);
  app.use((req, res) => {
    res.render('404');
  });
};

module.exports = routesHandle;
