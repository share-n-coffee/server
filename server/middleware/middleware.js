const express = require('express');
const session = require('express-session');
const cors = require('cors');
const config = require('../config/config');
const RandController = require('../randomizer/randController');
RandController.checkAllData();
RandController.selectEventForPairGenerating('5cd6f6c381371d297acb2fe0');

module.exports = app => {
  /**
   * express.json() is a built-in middleware function in Express.
   * It parses incoming requests with JSON payloads and is based on body-parser.
   */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));

  // app.use(cors(config.corsOptions));
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (config.corsOptions.origins.indexOf(origin) === -1) {
          const msg =
            'The CORS policy for this site does not ' +
            'allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      }
    })
  );
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false
    })
  );
};
