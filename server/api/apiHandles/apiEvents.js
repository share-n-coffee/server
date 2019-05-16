const express = require('express');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('../../database/dbController');

const router = express.Router();

router.get('/', (req, res) => {
  const DBController = new ClassDBController('event');

  DBController.getAllEvents()
    .then(events =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(events)
    )
    .catch(error => res.status(500).send(error));
});

router.get('/:id', (req, res) => {
  const eventId = req.params.id;

  if (ObjectId.isValid(eventId)) {
    const DBController = new ClassDBController('event');

    DBController.getEventById(eventId)
      .then(event => {
        return res
          .status(200)
          .set('Content-Type', 'application/json')
          .send(event);
      })
      .catch(error => res.status(500).send(error));
  } else {
    res.status(400).send('Request query must be a valid ObjectId!');
  }
});

module.exports = router;
