const jwt = require('jsonwebtoken');
const config = require('../config/config');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.header('Authorization')
    ? req.header('Authorization').replace('Bearer ', '')
    : false;

  if (!token) {
    return res.status(403).json({
      errors: [
        {
          msg: 'There is no token, authorization denied'
        }
      ]
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(403).json({
      errors: [{ msg: 'Token is not valid!' }]
    });
  }
};
