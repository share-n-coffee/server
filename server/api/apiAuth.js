const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const UserSchema = require('../database/models/user');
const config = require('../config/config');
const jwtAuth = require('../middleware/jwtAuth');

const Users = UserSchema('demo_user');

// route Post api/auth/admin
// eslint-disable-next-line consistent-return
router.post('/admin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({
      username
    });

    const checkPass = () => {
      if (password === user.admin.password) {
        return true;
      }
      return false;
    };

    if (!user || !checkPass()) {
      return res.status(403).json({
        errors: [
          {
            msg: 'Invalid Username or Password!'
          }
        ]
      });
    }

    const payload = {
      user: {
        // eslint-disable-next-line no-underscore-dangle
        _id: user._id,
        telegramUserId: user.telegramUserId,
        admin: user.admin
      }
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      {
        expiresIn: 60 * 60 * 24
      },
      (err, token) => {
        if (err) throw err;
        res.json({
          token
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(403).json({
      errors: [
        {
          msg: "Can't verify username and password!"
        }
      ]
    });
  }
});

// route GET api/auth/admin
router.get('/admin', async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('admin.password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(403).send('Access denied');
  }
});

router.route('/').put((req, res) => {
  const reqUser = req.body;

  function saveNewUser(user) {
    return new Promise((resolve, reject) => {
      const newUser = new Users({
        lastName: user.last_name,
        firstName: user.first_name,
        telegramUserId: user.id,
        avatar: user.photo_url,
        username: user.username
      });

      newUser.save((err, addedUser) => {
        if (err) reject(err);
        resolve(addedUser);
      });
    });
  }

  Users.findOne({
    username: reqUser.username
  }).then(user => {
    if (!user) {
      saveNewUser(reqUser).then(addedUser => res.json(addedUser));
    } else {
      res.json(user);
    }
  });
});

module.exports = router;
