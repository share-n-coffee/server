require('dotenv').config();

const express = require('express');
const middlewares = require('./server/middleware/middleware');
const routesHandle = require('./server/routes/routesHandle');
const connectDatabase = require('./server/database/connectDatabase');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = express();
connectDatabase();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/server/views`);
middlewares(app);
routesHandle(app);

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
