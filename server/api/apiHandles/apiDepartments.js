const express = require('express');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('../../database/dbController');
const jwtAuth = require('../../middleware/jwtAuth');
const adminAuth = require('../../middleware/adminAuth');

const router = express.Router();

router
  .route('/')
  .get(jwtAuth, (req, res) => {
    const DBController = new ClassDBController('department');

    console.log('deps');
    console.log(req.user);

    DBController.getAllDepartments()
      .then(departments => res.status(200).json(departments))
      .catch(error => res.status(404).send(error));
  })
  .post(jwtAuth, adminAuth, (req, res) => {
    const DBController = new ClassDBController('department');

    if (req.body.title) {
      DBController.postNewDepartment(req.body)
        .then(data => data)
        .then(addedDepartment => {
          res.status(200).json(addedDepartment);
        })
        .catch(error => res.status(404).send(error));
    } else {
      res.status(400).send('Request body must at least "title" parameter!');
    }
  });

router.route('/:id').get(jwtAuth, (req, res) => {
  const departmentId = req.params.id;

  if (ObjectId.isValid(departmentId)) {
    const DBController = new ClassDBController('department');

    DBController.getDepartmentById(departmentId)
      .then(department => res.status(200).json(department))
      .catch(error => res.status(404).send(error));
  } else {
    res.status(404).send('Request query must be a valid ObjectId!');
  }
});

module.exports = router;
