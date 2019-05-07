const mongoose = require('mongoose');
const config = require('./server/config/config.json');
const User = require('models/user.js');
const Event = require('models/event.js');
const Department = require('models/department.js')

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


