const { ObjectId } = require('mongoose').Types;

module.exports = (req, res, next) => {
  if (req.params.id && !ObjectId.isValid(req.params.id)) {
    res.status(404).send('Id is not valid ObjectId!');
  }
  next();
};
