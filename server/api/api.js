const config = require('../config/config');
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');


router.get('/user/:userID', (req, res) => {
  mongoose
    .connect(config.database, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log('Database is connected');
      User
        .findOne({ id: req.params.userID})
        .exec(function (err, user) {
          res.status(200).send(user);
        });
    })
    .catch(err => {
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
