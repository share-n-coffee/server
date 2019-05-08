const mongoose = require('mongoose');
const config = require('../config/config.js');
const Users = require('./models/user.js');
const Events = require('./models/event.js');
const Departments = require('./models/department.js');

function DBController() {
  const successMessage = () => {
    console.log('Database is connected');
  };

  const errorMessage = error => {
    console.log(`Can not connect to the database ${error}`);
  };

  const createRequest = query => {
    return new Promise((resolve, reject) => {
      mongoose
        .connect(
          config.database,
          {
            useNewUrlParser: true,
            useCreateIndex: true
          }
        )
        .then(() => {
          successMessage();
          resolve(query);
        })
        .catch(err => {
          reject(new Error(`Can not connect to the database ${err}`));
          errorMessage();
        });
    });
  };

  // use example:
  //
  // router.get('/users/:user_telegram_id', (req, res) => {
  //   DBController.getUserByTelegramId(req.params.user_telegram_id)
  //     .then(user => res.status(200).send(user))
  //     .catch(error => res.status(422).send(error));
  // });

  const getUserByTelegramId = id => {
    const query = Users.findOne({ id_telegram: id }).exec();
    return createRequest(query);
  };

  const getEventById = eventId => {
    const query = Events.findOne({ id: eventId }).exec();
    return createRequest(query);
  };

  const getAllEvents = () => {
    const query = Events.find({}).exec();
    return createRequest(query);
  };

  return { getUserByTelegramId, getEventById, getAllEvents };
}

module.exports = DBController();
