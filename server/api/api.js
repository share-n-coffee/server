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
    acceptedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
    visitedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
    bans: [{
      date: Date,
      duration: Date
    }]
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

const demo_department = mongoose.model('demo_department', new Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
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
const demo_departments = mongoose.model('demo_department');

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
        .findOne({ "id_telegram": req.params.user_telegram_id })
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
        .findOne({ "id": req.params.event_id })
        .exec(function (err, event) {
          res.status(200).send(event);
        });
    })
    .catch(err => {
      res.status(422).send({ 'Error': `Can not connect to the database ${err}` });
      console.log(`Can not connect to the database ${err}`);
    });
});

router.get('/events/', (req, res) => {
  mongoose
    .connect(config.database, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log('Database is connected');
      demo_events
        .find({})
        .exec(function (err, event) {
          res.status(200).send(event);
        });
    })
    .catch(err => {
      res.status(422).send({ 'Error': `Can not connect to the database ${err}` });
      console.log(`Can not connect to the database ${err}`);
    });
});

router.post('/users/:user_telegram_id/:department_id', (req, res) => {
  mongoose
    .connect(config.database, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log('Database is connected');
      console.log(req.params);
      
      demo_users.findOneAndUpdate(
        { 'id_telegram': req.params.user_telegram_id },
        {
          $set: { 'department': new mongoose.Types.ObjectId(req.params.department_id) }
        },
        (err, data) => {
          console.log('Department updated!');
          console.log(data);
          res.status(200).send(data);
        }
      );
    })
    .catch(err => {
      res.status(422).send({ 'Error': `Can not connect to the database ${err}` });
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
