const express = require('express');
const crypto = require('crypto');
const { ObjectId } = require('mongoose').Types;
const ClassDBController = require('./../../database/dbController');
const adminAuth = require('../../middleware/adminAuth');
const objectIdValidation = require('../../middleware/objectIdValidation');
const generatePagination = require('../../middleware/generatePagination');

const router = express.Router();

router.route('/').get(async (req, res) => {
  const DBController = new ClassDBController('user');

  DBController.findUsers(req)
    .then(users => res.status(200).json({ data: users }))
    .catch(error => res.status(404).send(error));
});

router
  .route('/:id')
  .get(objectIdValidation, (req, res) => {
    const DBController = new ClassDBController('user', 'department');
    req.query = {
      ...req.query,
      _id: req.params.id
    };

    DBController.findUsers(req)
      .then(users => {
        DBController.getDepartmentById(users[0].department)
          .then(department => {
            const answer = { data: users[0].toJSON() };
            answer.data.department = department.toJSON();
            return res.status(200).json(answer);
          })
          .catch(error => res.status(404).send(error));
      })
      .catch(error => res.status(404).send(error));
  })
  .put(objectIdValidation, (req, res) => {
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

    // if (req.body.eventId) {
    //   if (ObjectId.isValid(req.body.eventId)) {
    //     DBController.updateUsersEvents(req.params.id, req.body.eventId, 'add')
    //       .then(user => res.status(200).json({ data: user }))
    //       .catch(error => res.status(404).send(error));
    //   } else {
    //     res.status(404).send("New Event's _id is not valid ObjectId!");
    //   }
    // }

    if (req.body.admin) {
      if (!req.user.permission) {
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
    // const DBController = new ClassDBController('user');
    // if (req.body.eventId) {
    //   if (ObjectId.isValid(req.body.eventId)) {
    //     DBController.updateUsersEvents(
    //       req.params.id,
    //       req.body.eventId,
    //       'remove'
    //     )
    //       .then(user => res.status(200).json({ data: user }))
    //       .catch(error => res.status(404).send(error));
    //   } else {
    //     res.status(404).send("New Event's _id is not valid ObjectId!");
    //   }
    // }
  });

router.route('/ban/:id').put(adminAuth, objectIdValidation, (req, res) => {
  const searchId = req.params.id;
  const { ban } = req.body;

  if (ban) {
    const DBController = new ClassDBController('user');
    const userQuery = { _id: searchId };

    DBController.updateUser(userQuery, {
      banned: {
        expired: ban.status ? 4102389828505 : 0,
        ...ban
      }
    })
      .then(user => res.status(200).json({ data: user }))
      .catch(error => res.status(404).send(error));
  }
});

router.route('/:id/upcoming/').get(objectIdValidation, (req, res) => {
  const DBController = new ClassDBController('user', 'event');

  req.query = {
    participants: {
      $elemMatch: {
        status: 'accepted',
        userId: req.params.id
      }
    }
  };

  DBController.findEvents(req)
    .then(events => res.status(200).json({ data: events }))
    .catch(error => res.status(404).send(error));
});

module.exports = router;
