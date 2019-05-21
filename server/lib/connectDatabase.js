const mongoose = require('mongoose');
const logger = require('../logger');
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
      logger.error(error.toString());
    });
};

module.exports = connectDatabase;
