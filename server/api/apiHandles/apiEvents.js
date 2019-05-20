const express = require('express');
const ClassDBController = require('../../database/dbController');
const adminAuth = require('../../middleware/adminAuth');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    const DBController = new ClassDBController('event');

    DBController.getAllEvents(req.sorting)
      .then(events => res.status(200).json(events))
      .catch(error => res.status(404).send(error));
  })
  .post(adminAuth, (req, res) => {
    const DBController = new ClassDBController('event');

    DBController.postNewEvent(req.body)
      .then(addedEvent => {
        res.status(200).json(addedEvent);
      })
      .catch(error => res.status(404).send(error));
  });

router
  .route('/:id')
  .get((req, res) => {
    const DBController = new ClassDBController('event');

    DBController.getEventById(req.params.id)
      .then(event => {
        return res.status(200).json(event);
      })
      .catch(error => res.status(404).send(error));
  })
  .put(adminAuth, (req, res) => {
    const DBController = new ClassDBController('event');

    DBController.updateEvent(req.params.id, req.body)
      .then(updatedEvent => {
        res.status(200).json(updatedEvent);
      })
      .catch(error => res.status(404).send(error));
  });

module.exports = router;
