const mongoose = require('mongoose');
const logger = require('../logger');
const config = require('../config/config');

const connectionAttempts = 3;
const connectionTimeout = 10000;

const connectDatabase = (attempt = 0) => {
  mongoose
    .connect(
      config.database,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      }
    )
    .then(() => {
      console.log('Database is connected');
    })
    .catch(error => {
      if (attempt < connectionAttempts) {
        logger.error(`
          ${error.toString()}\nRetrying connection to Database #${attempt +
          1}`);
        setTimeout(() => {
          connectDatabase(attempt + 1);
        }, connectionTimeout);
      } else {
        logger.error('Failed connect to Database');
        process.exit(0);
      }
    });
};

module.exports = connectDatabase;
