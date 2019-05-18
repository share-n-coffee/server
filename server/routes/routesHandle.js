const ClassDBController = require('../database/dbController');
const authRoutes = require('../api/apiAuth');
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

  app.use('/api', jwtAuth, apiRoutes);
  app.use('/login', authRoutes);

  app.use((req, res) => {
    res.render('404');
  });
};

module.exports = routesHandle;
