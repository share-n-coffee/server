const express = require('express');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('./../../database/dbController');
const jwtAuth = require('../../middleware/jwtAuth');
const adminAuth = require('../../middleware/adminAuth');

const router = express.Router();

router.route('/').get((req, res) => {
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
});

router
  .route('/:userId', (req, res, next) => {
    req.userId = req.params.userId;
    if (!ObjectId.isValid(req.userId)) {
      res.status(404).send("User's id is not valid ObjectId!");
    }
    next();
  })
  .get((req, res) => {
    const DBController = new ClassDBController('user');
    DBController.getUserById(req.userId)
      .then(user => res.status(200).json(user))
      .catch(error => res.status(404).send(error));
  })
  .put(adminAuth, (req, res) => {
    if (ObjectId.isValid(req.body.newDepartment)) {
      const DBController = new ClassDBController('user');
      DBController.putUserDepartment(req.body.userId, req.body.newDepartment)
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).send(error));
    } else {
      res.status(404).send("New Department's id is not valid ObjectId!");
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
