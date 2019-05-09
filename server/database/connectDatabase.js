const mongoose = require('mongoose');
const config = require('../config/config');

const connectDatabase = () => {
  mongoose
    .connect(
      config.database,
      {
        useNewUrlParser: true,
        useCreateIndex: true
      }
    )
    .then(() => {
      console.log('Database is connected');
    })
    .catch(error => {
      console.log(`Can not connect to the database ${error}`);
    });
};

module.exports = connectDatabase;
