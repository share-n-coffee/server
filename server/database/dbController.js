const mongoose = require('mongoose');
const Users = require('./models/user.js');
const Events = require('./models/event.js');
const Departments = require('./models/department.js');

function DBController() {
  const getUserByTelegramId = id => {
    const query = Users.findOne({ id_telegram: id }).exec();
    return new Promise(query);
  };

  const getEventById = eventId => {
    const query = Events.findOne({
      _id: mongoose.Types.ObjectId(eventId)
    }).exec();
    return new Promise(query);
  };

  const getAllEvents = () => {
    const query = Events.find({}).exec();
    return new Promise(query);
  };

  return { getUserByTelegramId, getEventById, getAllEvents };
}

module.exports = DBController();
