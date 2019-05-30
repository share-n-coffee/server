const mongoose = require('mongoose');

const connectTestDatabase = mongoUri => {
  mongoose
    .connect(
      mongoUri,
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
      console.log('Database connection error: ', error);
    });
};

module.exports = connectTestDatabase;
