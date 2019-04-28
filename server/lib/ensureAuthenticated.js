const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send({});
  return false;
};

module.exports = ensureAuthenticated;
