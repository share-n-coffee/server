const express = require('express');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('../../database/dbController');
const jwtAuth = require('../../middleware/jwtAuth');
const adminAuth = require('../../middleware/adminAuth');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    const DBController = new ClassDBController('event');

    DBController.getAllEvents()
      .then(events => res.status(200).json(events))
      .catch(error => res.status(404).send(error));
  })
  .post((req, res) => {
    const DBController = new ClassDBController('event');

    DBController.postNewEvent(req.body)
      .then(addedEvent => {
        res.status(200).json(addedEvent);
      })
      .catch(error => res.status(404).send(error));
  });

router.route('/:id').get((req, res) => {
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
