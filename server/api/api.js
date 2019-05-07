const config = require('../config/config');
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/*
* This is demo functionality, that's must be removed when DB-Controller will be done
* vvvvvvvv
*/
const demo_user = mongoose.model('demo_user', new Schema({
  id: {
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
  }
}));

const demo_event = mongoose.model('demo_event', new Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desciption: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  regularity: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
}));

const demo_users = mongoose.model('demo_user');
const demo_events = mongoose.model('demo_event');

/*
* ^^^^^^^^^^
* This is demo functionality, that's must be removed when DB-Controller will be done
*/

router.get('/users/:user_telegram_id', (req, res) => {
  mongoose
    .connect(config.database, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log('Database is connected');
      demo_users
        .findOne({ "id_telegram": req.params.user_telegram_id})
        .exec(function (err, user) {
          res.status(200).send(user);
        });
    })
    .catch(err => {
      res.status(422).send({ 'Error': `Can not connect to the database ${err}` });
      console.log(`Can not connect to the database ${err}`);
    });
});

router.get('/events/:event_id', (req, res) => {
  mongoose
    .connect(config.database, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log('Database is connected');
      demo_events
        .findOne({ "id": req.params.event_id})
        .exec(function (err, event) {
          res.status(200).send(event);
        });
    })
    .catch(err => {
      res.status(422).send({ 'Error': `Can not connect to the database ${err}`});
      console.log(`Can not connect to the database ${err}`);
    });
});

// router.post("/user", (req, res) => {
//   res.send({ method: "POST" });
// });

// router.put("/user/:id", (req, res) => {
//   res.send({ method: "PUT" });
// });

// router.delete("/user/:id", (req, res) => {
//   res.send({ method: "DELETE" });
// });

module.exports = router;
