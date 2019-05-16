const express = require('express');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('../../database/dbController');
const jwtAuth = require('../../middleware/jwtAuth');
const adminAuth = require('../../middleware/adminAuth');

const router = express.Router();

router.route('/').get(jwtAuth, (req, res) => {
  const DBController = new ClassDBController('event');

  DBController.getAllEvents()
    .then(events => res.status(200).json(events))
    .catch(error => res.status(404).send(error));
});

router.route('/:id').get(jwtAuth, (req, res) => {
  const eventId = req.params.id;

  if (ObjectId.isValid(eventId)) {
    const DBController = new ClassDBController('event');

    DBController.getEventById(eventId)
      .then(event => {
        return res.status(200).json(event);
      })
      .catch(error => res.status(404).send(error));
  } else {
    res.status(404).send('Request query must be a valid ObjectId!');
  }
});

module.exports = router;
