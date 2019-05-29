/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ClassDBController = require('../database/dbController');

const logger = require('./../logger');

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
  const DBController = new ClassDBController('user', 'department', 'log');

  DBController.getUserByTelegramId(reqUser.id)
    .then(async takenUser => {
      const user =
        takenUser === null
          ? await DBController.createNewUser(reqUser)
          : takenUser;

      let { department } = user || null;

      if (department) {
        department = await DBController.findOneDepartment(
          {
            _id: user.department
          },
          'title description'
        );
      }

      logger.info(user._id, 'user_login', {
        action: `${user.username} is logged in via Telegram`
      });
      res.json({ token: createJWT(createPayload(user, department)) });
    })
    .catch(err => console.log(err));
});

router.route('/admin').post(async (req, res) => {
  const { username, password } = req.body;

  const DBController = new ClassDBController('user', 'department', 'log');
  const user = await DBController.findOneUser({
    username
  });

  if (
    !(user && +user.admin.permission !== 0 && password === user.admin.password)
  ) {
    logger.info(null, 'admin_login', {
      action: `${username} trying login as admin with wrong username or password`
    });

    return res.status(403).json({
      errors: [
        {
          msg:
            user && +user.admin.permission === 0
              ? "You don't have permissions!"
              : 'Invalid Username or Password!'
        }
      ]
    });
  }

  const department = await DBController.findOneDepartment(
    {
      _id: user.department
    },
    'title description'
  );

  logger.info(user._id, 'admin_login', {
    action: `${user.username} is logged in as admin`
  });
  return res.json({ token: createJWT(createPayload(user, department)) });
});

module.exports = {
  router,
  createPayload,
  createJWT
};
