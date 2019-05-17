const express = require('express');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('./../../database/dbController');
const jwtAuth = require('../../middleware/jwtAuth');
const adminAuth = require('../../middleware/adminAuth');

const router = express.Router();

router
  .route('/')
  .get((req, res) => {
    const DBController = new ClassDBController('user');

    if (Object.keys(req.query).length) {
      /*
       *  Enable query search
       *  example: /api/users?firstName=Washington
       *  if query didn't find anything, it's return empty array
       */
      DBController.querySearch(req.query)
        .then(results => res.status(200).json(results))
        .catch(error => res.status(404));
    } else {
      DBController.getAllUsers()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(404).send(error));
    }
  })
  .put(adminAuth, (req, res) => {
    if (
      ObjectId.isValid(req.body.userId) &&
      ObjectId.isValid(req.body.newDepartment)
    ) {
      const DBController = new ClassDBController('user');

      if (ObjectId.isValid(req.body.newDepartment)) {
        DBController.putUserDepartment(req.body.userId, req.body.newDepartment)
          .then(user => res.status(200).json(user))
          .catch(error => res.status(404).send(error));
      } else {
        res.status(404).send(`
          Request body must have valid "userId" AND ("newDepartment" OR "newTelegramChatId") parameters!
        `);
      }
    }
  });

router.route('/:id').get((req, res) => {
  const DBController = new ClassDBController('user');
  const searchId = req.params.id;
  if (ObjectId.isValid(searchId)) {
    DBController.getUserById(searchId)
      .then(user => res.status(200).json(user))
      .catch(error => res.status(404).send(error));
  } else {
    DBController.getUserByTelegramId(searchId)
      .then(user => res.status(200).send(user))
      .catch(error => res.status(404).send(error));
  }
});

router.route('/ban/:userId').put(adminAuth, (req, res) => {
  const searchId = req.params.userId;
  const { ban } = req.body;

  if (ban) {
    const DBController = new ClassDBController('user');
    let userQuery = { telegramUserId: searchId };

    if (ObjectId.isValid(searchId)) {
      userQuery = { _id: searchId };
    }

    DBController.putUserBan(userQuery, {
      expired: ban.status ? 4102389828505 : 0,
      ...ban
    })
      .then(user => res.status(200).json(user))
      .catch(error => res.status(404).send(error));
  }
});

module.exports = router;
