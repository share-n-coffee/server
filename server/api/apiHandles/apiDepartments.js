const express = require('express');
const ClassDBController = require('../../database/dbController');
const adminAuth = require('../../middleware/adminAuth');
const objectIdValidation = require('./../../middleware/objectIdValidation');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    const DBController = new ClassDBController('department');

    DBController.findDepartments(req)
      .then(async departments => {
        const pagination = {};

        if (req.pagination.limit > 0) {
          const total = await DBController.countDepartments();
          const totalPages = Math.ceil(total / req.pagination.limit);

          pagination.pages = {
            total: totalPages
          };
        }

        return res.status(200).json({ data: departments, ...pagination });
      })
      .catch(error => res.status(404).send(error));
  })
  .post(adminAuth, (req, res) => {
    const DBController = new ClassDBController('department');

    if (req.body.title) {
      DBController.postNewDepartment(req.body)
        .then(addedDepartment => {
          res.status(200).json({ data: addedDepartment });
        })
        .catch(error => res.status(404).send(error));
    } else {
      res.status(400).send('Request body must at least "title" parameter!');
    }
  });

router
  .route('/:id')
  .get(objectIdValidation, (req, res) => {
    const DBController = new ClassDBController('department');

    DBController.findOneDepartment({ _id: req.params.id })
      .then(department => res.status(200).json({ data: department }))
      .catch(error => res.status(404).send(error));
  })
  .put(adminAuth, objectIdValidation, (req, res) => {
    const DBController = new ClassDBController('department');

    DBController.updateDepartment(req.params.id, req.body)
      .then(updatedDepartment => {
        res.status(200).json({ data: updatedDepartment });
      })
      .catch(error => res.status(404).send(error));
  });

module.exports = router;
