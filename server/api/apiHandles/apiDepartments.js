const express = require('express');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('../../database/dbController');

const router = express.Router();

router.get('/', (req, res) => {
  const DBController = new ClassDBController();

  if (!req.body.departmentId) {
    DBController.getAllDepartments()
      .then(departments =>
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .send(departments)
      )
      .catch(error => res.status(500).send(error));
  } else if (ObjectId.isValid(req.body.departmentId)) {
    DBController.getDepartmentById(req.body.departmentId)
      .then(department =>
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .send(department)
      )
      .catch(error => res.status(422).send(error));
  } else {
    res.status(400).send('Request body must have valid ObjectId!');
  }
});

router.post('/', (req, res) => {
  const DBController = new ClassDBController();

  if (req.body.title) {
    DBController.postNewDepartment(req.body)
      .then(data => data)
      .then(addedDepartment => {
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .send(addedDepartment);
      })
      .catch(error => res.status(422).send(error));
  } else {
    res.status(400).send('Request body must at least "title" parameter!');
  }
});

module.exports = router;
