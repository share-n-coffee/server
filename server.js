require('dotenv').config();

const express = require('express');
const middlewares = require('./server/middleware/middleware');
const routesHandle = require('./server/routes/routesHandle');
const mongoose = require('mongoose');
const config = require('./server/config/config');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = express();

mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Database is connected');
  })
  .catch(err => {
    console.log(`Can not connect to the database ${err}`);
  });

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/server/views`);
middlewares(app);
routesHandle(app);

app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
