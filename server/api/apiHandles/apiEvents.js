const express = require('express');
const DBController = require('../../database/dbController');

const router = express.Router();

router.get('/', (req, res) => {
  DBController.getAllEvents()
    .then(events =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(events)
    )
    .catch(error => res.status(422).send(error));
});

router.get('/:event_id', (req, res) => {
  DBController.getEventById(req.params.event_id)
    .then(event =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(event)
    )
    .catch(error => res.status(422).send(error));
});

module.exports = router;
