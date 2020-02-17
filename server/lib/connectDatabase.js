const mongoose = require('mongoose');
const logger = require('../logger');
const config = require('../config/config');

let databaseConnectionAttempts = 0;

const connectDatabase = () => {
  mongoose
    .connect(
      config.DATABASE,
      {
        useNewUrlParser: true,
        useCreateIndex: true
      }
    )
    .then(() => {
      console.log('Database is connected');
    })
    .catch(error => {
      if (
        databaseConnectionAttempts < config.MAX_DATABASE_CONNECTION_ATTEMPTS
      ) {
        databaseConnectionAttempts += 1;

        setTimeout(() => {
          console.log(
            `Retrying connect to database [${databaseConnectionAttempts}/${
              config.MAX_DATABASE_CONNECTION_ATTEMPTS
            }]`
          );
          connectDatabase();
        }, 1000);
      } else {
        logger.error('MAX_DATABASE_CONNECTION_ATTEMPTS reached!');
        logger.error(error.toString());
      }
    });
};

module.exports = connectDatabase;
