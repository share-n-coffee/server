module.exports = (req, res, next) =>
  req.user.admin.isAdmin === true
    ? next()
    : res.status(403).json({
        errors: [{ msg: 'Forbidden – Access denied' }]
      });
