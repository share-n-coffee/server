const express = require('express');
const { ObjectId } = require('mongoose').Types;
const DBController = require('../../database/dbController');

const router = express.Router();

router.get('/', (req, res) => {
  if (!req.body.eventId) {
    DBController.getAllEvents()
      .then(events =>
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .send(events)
      )
      .catch(error => res.status(500).send(error));
  } else if (ObjectId.isValid(req.body.eventId)) {
    DBController.getEventById(req.body.eventId)
      .then(event =>
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .send(event)
      )
      .catch(error => res.status(500).send(error));
  } else {
    res.status(400).send('Request body must have valid ObjectId!');
  }
});

module.exports = router;
