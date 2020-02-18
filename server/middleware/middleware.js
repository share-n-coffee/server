const express = require('express');
const cors = require('cors');
const config = require('../config/config');

function checkOrigin(origin, callback) {
  if (config.CORS.origins.includes(origin)) {
    return callback(null, true);
  }

  const msg =
    'The CORS policy for this site does not allow access from the specified Origin.';
  return callback(new Error(msg), false);
}

const CORS_POLITICS =
  config.CORS.enabled && config.CORS.origins ? checkOrigin : false;

module.exports = app => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));

  const { methods, credentials } = config.CORS;
  app.use(
    cors({
      origin: CORS_POLITICS,
      methods,
      credentials
    })
  );
};
