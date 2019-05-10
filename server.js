require('dotenv').config();

const express = require('express');
const middlewares = require('./server/middleware/middleware');
const routesHandle = require('./server/routes/routesHandle');
const connectDatabase = require('./server/lib/connectDatabase');
const setViewEngine = require('./server/lib/setViewEngine');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = express();

connectDatabase();

setViewEngine(app);

middlewares(app);

routesHandle(app);

app.use('/api/auth', require('./server/api/auth'));

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
