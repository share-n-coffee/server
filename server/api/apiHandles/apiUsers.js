const express = require('express');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('./../../database/dbController');

const router = express.Router();

router.get('/', (req, res) => {
  const DBController = new ClassDBController('user');

  DBController.getAllUsers()
    .then(users =>
      res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(users)
    )
    .catch(error => res.status(422).send(error));
});

router.get('/:id', (req, res) => {
  const DBController = new ClassDBController('user');
  const searchId = req.params.id;

  if (ObjectId.isValid(searchId)) {
    DBController.getUserById(searchId)
      .then(user =>
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .send(user)
      )
      .catch(error => res.status(422).send(error));
  } else {
    DBController.getUserByTelegramId(searchId)
      .then(user =>
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .send(user)
      )
      .catch(error => res.status(422).send(error));
  }
});

router.put('/', (req, res) => {
  if (
    ObjectId.isValid(req.body.userId) &&
    (ObjectId.isValid(req.body.newDepartment) || req.body.newTelegramChatId)
  ) {
    const DBController = new ClassDBController('user');

    if (ObjectId.isValid(req.body.newDepartment)) {
      DBController.putUserDepartment(req.body.userId, req.body.newDepartment)
        .then(user =>
          res
            .status(200)
            .set('Content-Type', 'application/json')
            .send(user)
        )
        .catch(error => res.status(422).send(error));
    } else {
      DBController.putUserTelegramChatId(
        req.body.userId,
        req.body.newTelegramChatId
      )
        .then(user =>
          res
            .status(200)
            .set('Content-Type', 'application/json')
            .send(user)
        )
        .catch(error => res.status(422).send(error));
    }
  } else {
    res.status(400).send(`
      Request body must have valid "userId" AND ("newDepartment" OR "newTelegramChatId") parameters!
    `);
  }
});

module.exports = router;
