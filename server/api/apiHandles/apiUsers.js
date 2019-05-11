const express = require('express');
const DBController = require('./../../database/dbController');

const router = express.Router();

router.get('/:user_telegram_id', (req, res) => {
  DBController.getUserByTelegramId(req.params.user_telegram_id)
    .then(user =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(user)
    )
    .catch(error => res.status(422).send(error));
});

router.get('/', (req, res) => {
  DBController.getAllUsers()
    .then(users =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(users)
    )
    .catch(error => res.status(422).send(error));
});

router.put('/:user_telegram_id/:department_id', (req, res) => {
  DBController.putUserDepartment(
    req.params.user_telegram_id,
    req.params.department_id
  )
    .then(user =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(user)
    )
    .catch(error => res.status(422).send(error));
});

module.exports = router;
