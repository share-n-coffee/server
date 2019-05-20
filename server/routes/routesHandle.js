const authRoutes = require('../api/apiAuth');
const apiRoutes = require('../api/api');
const jwtAuth = require('../middleware/jwtAuth');
const getQuery = require('../middleware/getQuery');

const routesHandle = app => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.use('/api', jwtAuth, getQuery, apiRoutes);
  app.use('/login', authRoutes);

  app.use((req, res) => {
    res.render('404');
  });
};

module.exports = routesHandle;
