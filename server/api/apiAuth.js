/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ClassDBController = require('../database/dbController');

const tokenLifeTime = 60 * 60 * 24 * 7;

function createJWT(data) {
  return jwt.sign({ data }, config.jwtSecret, { expiresIn: tokenLifeTime });
}

function createPayload(user, department) {
  const payload = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    department,
    avatar: user.avatar,
    banned: user.banned,
    permission: user.admin.permission
  };

  return payload;
}

router.route('/').post((req, res) => {
  const reqUser = req.body;
  const usersController = new ClassDBController('user');

  usersController.getUserByTelegramId(reqUser.id).then(async takenUser => {
    const user = takenUser || (await usersController.createNewUser(reqUser));

    const departmentController = new ClassDBController('department');
    const department = await departmentController.findOne(
      {
        _id: user.department
      },
      'title description'
    );

    res.json({ token: createJWT(createPayload(user, department)) });
  });
});

router.route('/admin').post(async (req, res) => {
  const { username, password } = req.body;

  const usersController = new ClassDBController('user');
  const user = await usersController.findOne({
    username
  });

  if (
    !user ||
    +user.admin.permission === 0 ||
    password !== user.admin.password
  ) {
    return res.status(403).json({
      errors: [
        {
          msg:
            +user.admin.permission === 0
              ? "You don't have permissions!"
              : 'Invalid Username or Password!'
        }
      ]
    });
  }

  const departmentController = new ClassDBController('department');
  const department = await departmentController.findOne(
    {
      _id: user.department
    },
    'title description'
  );

  return res.json({ token: createJWT(createPayload(user, department)) });
});

module.exports = router;
