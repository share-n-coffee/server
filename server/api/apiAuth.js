/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const UserSchema = require('../database/models/user');
const config = require('../config/config');
const ClassDBController = require('../database/dbController');

const Users = UserSchema('demo_user');
const tokenLifeTime = 60 * 60 * 24 * 7;

function createJWT(data) {
  return jwt.sign({ data }, config.JWT_SECRET, { expiresIn: tokenLifeTime });
}

function createPayload(user) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    department: user.department,
    avatar: user.avatar,
    banned: user.banned,
    isAdmin: user.admin.isAdmin
  };
}

router.route('/admin').post(async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({
    username
  });

  if (!user || !user.admin.isAdmin || password !== user.admin.password) {
    return res.status(403).json({
      errors: [
        {
          msg: !user.admin.isAdmin
            ? "You don't have permissions!"
            : 'Invalid Username or Password!'
        }
      ]
    });
  }

  return res.json({ token: createJWT(createPayload(user)) });
});

router.route('/').post(async (req, res) => {
  console.log(`Login attempt: ${JSON.stringify(req.body)}`);
  const reqUser = req.body;

  if (reqUser.id) {
    let user = await Users.findOne({ telegramUserId: reqUser.id });

    console.log(user ? 'User exists' : 'Create new user');

    if (!user) {
      const DBController = new ClassDBController('user');
      user = await DBController.saveNewUser(reqUser);
    }

    console.log(user);
    res.json({ token: createJWT(createPayload(user)) });
  } else {
    console.log('ERROR: user id required');
    res.status(400).json({ error: 'user_id_required' });
  }
});

module.exports = router;
