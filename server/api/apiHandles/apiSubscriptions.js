const express = require('express');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('../../database/dbController');
const adminAuth = require('../../middleware/adminAuth');
const objectIdValidation = require('../../middleware/objectIdValidation');

const router = express.Router();

router.route('/').get((req, res) => {
  const DBController = new ClassDBController('subscription');

  DBController.findSubscriptions(req)
    .then(subscriptions => {
      return res.status(200).json({ data: subscriptions });
    })
    .catch(error => res.status(404).send(error));
});

router.route('/topic/:id').get(objectIdValidation, (req, res) => {
  const DBController = new ClassDBController('subscription');
  req.query = {
    ...req.query,
    topicId: req.params.id
  };

  DBController.findSubscriptions(req)
    .then(subscribedUsers => {
      const usersId = subscribedUsers.map(user => user.userId);
      return res.status(200).json({ data: usersId });
    })
    .catch(error => res.status(404).send(error));
});

module.exports = router;
