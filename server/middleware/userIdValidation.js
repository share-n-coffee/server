const { ObjectId } = require('mongoose').Types;

module.exports = (req, res, next) => {
  if (!ObjectId.isValid(req.params.userId)) {
    res.status(404).send("User's id is not valid ObjectId!");
  }
  next();
};
