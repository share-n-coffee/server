const mongoose = require('mongoose');
const Users = require('./models/user.js');
const Events = require('./models/event.js');
const Departments = require('./models/department.js');

function DBController(
  users = Users,
  events = Events,
  departments = Departments
) {
  const getUserByTelegramId = id => {
    const query = users.findOne({ id_telegram: id }).exec();
    return new Promise(query);
  };

  const getEventById = eventId => {
    const query = events
      .findOne({
        _id: mongoose.Types.ObjectId(eventId)
      })
      .exec();
    return new Promise(query);
  };

  const getAllEvents = () => {
    const query = events.find({}).exec();
    return new Promise(query);
  };

  return { getUserByTelegramId, getEventById, getAllEvents };
}

module.exports = DBController();
