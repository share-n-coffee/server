const express = require('express');
const ClassDBController = require('../../database/dbController');
const adminAuth = require('../../middleware/adminAuth');
const objectIdValidation = require('../../middleware/objectIdValidation');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    const DBController = new ClassDBController('event');

    DBController.find(
      req.query,
      req.fields,
      req.sorting,
      +req.pagination.skip,
      +req.pagination.limit
    )
      .then(events => res.status(200).json({ data: events }))
      .catch(error => res.status(404).send(error));
  })
  .post(adminAuth, (req, res) => {
    const DBController = new ClassDBController('event');

    DBController.postNewEvent(req.body)
      .then(addedEvent => {
        res.status(200).json({ data: addedEvent });
      })
      .catch(error => res.status(404).send(error));
  });

router
  .route('/:id', objectIdValidation)
  .get((req, res) => {
    const DBController = new ClassDBController('event');

    DBController.getEventById(req.params.id)
      .then(event => {
        return res.status(200).json({ data: event });
      })
      .catch(error => res.status(404).send(error));
  })
  .put(adminAuth, (req, res) => {
    const DBController = new ClassDBController('event');

    DBController.updateEvent(req.params.id, req.body)
      .then(updatedEvent => {
        res.status(200).json({ data: updatedEvent });
      })
      .catch(error => res.status(404).send(error));
  });

module.exports = router;
