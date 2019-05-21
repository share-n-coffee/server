const express = require('express');
const crypto = require('crypto');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('./../../database/dbController');
const adminAuth = require('../../middleware/adminAuth');
const objectIdValidation = require('../../middleware/objectIdValidation');

const router = express.Router();

router.route('/').get((req, res) => {
  const DBController = new ClassDBController('user');

  DBController.querySearch(req.query, req.fields, req.sorting)
    .then(results => res.status(200).json({ data: results }))
    .catch(error => res.status(404));
});

router
  .route('/:id', objectIdValidation)
  .get((req, res) => {
    const DBController = new ClassDBController('user');

    DBController.querySearch({ _id: req.params.id }, req.fields, req.sorting)
      .then(user => res.status(200).json({ data: user }))
      .catch(error => res.status(404).send(error));
  })
  .put((req, res) => {
    const DBController = new ClassDBController('user');

    if (req.body.newDepartment) {
      if (ObjectId.isValid(req.body.newDepartment)) {
        DBController.updateUser(req.params.id, {
          department: req.body.newDepartment
        })
          .then(user => res.status(200).json({ data: user }))
          .catch(error => res.status(404).send(error));
      } else {
        res.status(404).send("New Department's id is not valid ObjectId!");
      }
    }

    if (req.body.eventId) {
      if (ObjectId.isValid(req.body.eventId)) {
        DBController.updateUsersEvents(req.params.id, req.body.eventId, 'add')
          .then(user => res.status(200).json({ data: user }))
          .catch(error => res.status(404).send(error));
      } else {
        res.status(404).send("New Event's _id is not valid ObjectId!");
      }
    }

    if (req.body.admin) {
      if (!req.user.admin.isAdmin) {
        res.status(403).json({
          errors: [{ msg: 'Forbidden – Access denied' }]
        });
      }

      if (req.body.admin.password) {
        req.body.admin.password = crypto
          .createHash('md5')
          .update(req.body.admin.password)
          .digest('hex');
      }

      DBController.updateUser(req.params.id, {
        admin: req.body.admin
      })
        .then(user => res.status(200).json({ data: user }))
        .catch(error => res.status(404).send(error));
    }
  })
  .delete((req, res) => {
    const DBController = new ClassDBController('user');

    if (req.body.eventId) {
      if (ObjectId.isValid(req.body.eventId)) {
        DBController.updateUsersEvents(
          req.params.id,
          req.body.eventId,
          'remove'
        )
          .then(user => res.status(200).json({ data: user }))
          .catch(error => res.status(404).send(error));
      } else {
        res.status(404).send("New Event's _id is not valid ObjectId!");
      }
    }
  });

router.route('/ban/:id', objectIdValidation).put(adminAuth, (req, res) => {
  const searchId = req.params.id;
  const { ban } = req.body;

  if (ban) {
    const DBController = new ClassDBController('user');
    const userQuery = { _id: searchId };

    DBController.putUserBan(userQuery, {
      expired: ban.status ? 4102389828505 : 0,
      ...ban
    })
      .then(user => res.status(200).json({ data: user }))
      .catch(error => res.status(404).send(error));
  }
});

module.exports = router;
