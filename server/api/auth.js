const express = require('express');

const router = express.Router();
// const User = require('../database/models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config/config');
const auth = require('../middleware/auth');

const Schema = mongoose.Schema;

/*
* This is demo functionality, that's must be removed when DB-Controller will be done
* vvvvvvvv
*/
const demoUser = new Schema({
  id_telegram: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  isBanned: {
    type: Boolean,
    required: true,
    default: false
  },
  events: {
    type: Array,
    required: true,
    default: []
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  birthday: {
    type: Date,
    required: true,
    default: null
  },
  gender: {
    type: String,
    required: true,
    default: null
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  logs: {
    acceptedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      }
    ],
    visitedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      }
    ],
    bans: [
      {
        date: Date,
        duration: Date
      }
    ]
  },
  admin: {
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
    password: {
      type: String,
      required: true,
      default: null
    }
  }
});

const demoUsers = mongoose.model('demo_user');

// route Post api/auth/admin
router.post('/admin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await demoUsers.findOne({ username });
    const checkPass = () => {
      if (password === user.admin.password) {
        return true;
      }
      return false;
    };

    if (!user || !checkPass()) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, config.jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//route GET api/auth/admin
router.get('/admin', auth, async (req, res) => {
  try {
    const user = await demoUsers
      .findById(req.user.id)
      .select('-admin.password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
