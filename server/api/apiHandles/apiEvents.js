const express = require('express');
const ClassDBController = require('../../database/dbController');
const adminAuth = require('../../middleware/adminAuth');
const objectIdValidation = require('../../middleware/objectIdValidation');

const router = express.Router();

router.route('/').get((req, res) => {
  const DBController = new ClassDBController('event');

  DBController.findEvents(req)
    .then(async events => {
      const pagination = {};

      if (req.pagination.limit > 0) {
        const total = await DBController.countEvents();
        const totalPages = Math.ceil(total / req.pagination.limit);

        pagination.pages = {
          total: totalPages
        };
      }

      return res.status(200).json({ data: events, ...pagination });
    })
    .catch(error => res.status(404).send(error));
});

router.route('/:id').get(objectIdValidation, (req, res) => {
  const DBController = new ClassDBController('event');

  req.query = {
    ...req.query,
    _id: req.params.id
  };

  DBController.findEvents(req)
    .then(topic => {
      return res.status(200).json({ data: topic });
    })
    .catch(error => res.status(404).send(error));
});

module.exports = router;
