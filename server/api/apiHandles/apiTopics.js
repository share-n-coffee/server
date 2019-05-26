const express = require('express');
const ClassDBController = require('../../database/dbController');
const adminAuth = require('../../middleware/adminAuth');
const objectIdValidation = require('../../middleware/objectIdValidation');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    const DBController = new ClassDBController('topic');

    DBController.findTopics(req)
      .then(topics => res.status(200).json({ data: topics }))
      .catch(error => res.status(404).send(error));
  })
  .post(adminAuth, (req, res) => {
    const DBController = new ClassDBController('topic');

    DBController.postNewTopic(req.body)
      .then(newTopic => {
        res.status(200).json({ data: newTopic });
      })
      .catch(error => res.status(404).send(error));
  });

router
  .route('/:id', objectIdValidation)
  .get((req, res) => {
    const DBController = new ClassDBController('topic');
    req.query = {
      ...req.query,
      _id: req.params.id
    };

    DBController.findTopics(req)
      .then(topic => {
        return res.status(200).json({ data: topic });
      })
      .catch(error => res.status(404).send(error));
  })
  .put(adminAuth, (req, res) => {
    const DBController = new ClassDBController('topic');

    DBController.updateTopic(req.params.id, req.body)
      .then(updatedTopic => {
        res.status(200).json({ data: updatedTopic });
      })
      .catch(error => res.status(404).send(error));
  });

module.exports = router;
