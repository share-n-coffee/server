module.exports = (req, res, next) =>
  +req.user.permission > 0
    ? next()
    : res.status(403).json({
        errors: [{ msg: 'Forbidden – Access denied' }]
      });
