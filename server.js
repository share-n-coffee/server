require('dotenv').config();

const express = require('express');
const middlewares = require('./server/middleware/middleware');
const routesHandle = require('./server/routes/routesHandle');
const connectDatabase = require('./server/lib/connectDatabase');
const setViewEngine = require('./server/lib/setViewEngine');
const checkEnvironment = require('./server/lib/checkEnvironment');
const config = require('./server/config/config');
require('./server/reminder/reminder');

const dev = process.env.NODE_ENV !== 'production';

const app = express();

connectDatabase();

setViewEngine(app);

middlewares(app);

routesHandle(app);

checkEnvironment(
  config,
  app.listen(config.port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${config.port}`);
  })
);
