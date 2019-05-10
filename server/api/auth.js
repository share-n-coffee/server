const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require('../database/models/user');
const config = require('../config/config');
const auth = require('../middleware/auth');

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
      return res.status(400).json({
        errors: [
          {
            msg: 'Invalid Credentials'
          }
        ]
      });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      {
        expiresIn: 3600
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
    res.status(500).send('Server error');
  }
});

// route GET api/auth/admin
router.get('/admin', auth, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('-admin.password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
