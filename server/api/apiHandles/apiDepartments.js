const express = require('express');
const DBController = require('../../database/dbController');

const router = express.Router();

router.get('/:department_id', (req, res) => {
  DBController.getDepartmentById(req.params.department_id)
    .then(department =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(department)
    )
    .catch(error => res.status(422).send(error));
});

router.get('/', (req, res) => {
  DBController.getAllDepartments()
    .then(departments =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(departments)
    )
    .catch(error => res.status(422).send(error));
});

router.post('/', (req, res) => {
  DBController.postNewDepartment(req.body)
    .then(data => data)
    .then(addedDepartment => {
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(addedDepartment);
    })
    .catch(error => res.status(422).send(error));
});

module.exports = router;
