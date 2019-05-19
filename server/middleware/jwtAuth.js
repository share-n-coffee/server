const jwt = require('jsonwebtoken');
const config = require('../config/config');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.header('Authorization')
    ? req.header('Authorization').replace('Bearer ', '')
    : false;

  if (!token) {
    return res.status(403).json({
      errors: [{ msg: 'There is no token, authorization denied' }]
    });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      res.status(403).json({
        errors: [{ msg: 'Token is not valid!' }]
      });
    } else {
      const endDate = decoded.exp * 1000;
      const currentDate = new Date().getTime();

      if (endDate - currentDate <= 0) {
        res.status(403).json({
          errors: [{ msg: 'Your token is expired!' }]
        });
      } else {
        req.user = decoded.data;
        next();
      }
    }
  });
};
