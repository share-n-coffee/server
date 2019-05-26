const authRoutes = require('../api/apiAuth');
const apiRoutes = require('../api/api');
const jwtAuth = require('../middleware/jwtAuth');
const parseQuery = require('../middleware/parseQuery');

const routesHandle = app => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.use('/api', jwtAuth, parseQuery, apiRoutes);
  app.use('/login', authRoutes);

  app.use((req, res) => {
    res.status(404).render('404');
  });
};

module.exports = routesHandle;
