const express = require('express');
const ClassDBController = require('../../database/dbController');
const adminAuth = require('../../middleware/adminAuth');
const objectIdValidation = require('./../../middleware/objectIdValidation');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    const DBController = new ClassDBController('department');

    DBController.getAllDepartments(req.sorting)
      .then(departments => res.status(200).json(departments))
      .catch(error => res.status(404).send(error));
  })
  .post(adminAuth, (req, res) => {
    const DBController = new ClassDBController('department');

    if (req.body.title) {
      DBController.postNewDepartment(req.body)
        .then(addedDepartment => {
          res.status(200).json(addedDepartment);
        })
        .catch(error => res.status(404).send(error));
    } else {
      res.status(400).send('Request body must at least "title" parameter!');
    }
  });

router
  .route('/:id', objectIdValidation)
  .get((req, res) => {
    const DBController = new ClassDBController('department');

    DBController.getDepartmentById(req.params.id)
      .then(department => res.status(200).json(department))
      .catch(error => res.status(404).send(error));
  })
  .put(adminAuth, (req, res) => {
    const DBController = new ClassDBController('department');
    DBController.updateDepartment(req.params.id, req.body)
      .then(updatedDepartment => {
        res.status(200).json(updatedDepartment);
      })
      .catch(error => res.status(404).send(error));
  });

module.exports = router;
