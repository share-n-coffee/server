const config = require('../config/config');
const express = require("express");
const router = express.Router();

const DBController = require('./../database/dbController');

router.get('/users/:user_telegram_id', (req, res) => {
  DBController.getUserByTelegramId(req.params.user_telegram_id)
    .then(user => res.status(200).send(user))
    .catch(error => res.status(422).send(error));
});

router.get('/events/:event_id', (req, res) => {
  DBController.getEventById(req.params.event_id)
    .then(event => res.status(200).send(event))
    .catch(error => res.status(422).send(error));
});

router.get('/events/', (req, res) => {
  DBController.getAllEvents()
    .then(events => res.status(200).send(events))
    .catch(error => res.status(422).send(error));
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

module.exports = router;
