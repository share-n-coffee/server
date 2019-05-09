const mongoose = require('mongoose');
const Users = require('./models/user.js');
const Events = require('./models/event.js');
const Departments = require('./models/department.js');

function DBController() {
  const getUserByTelegramId = id => {
    return Users.findOne({ id_telegram: id }).exec();
  };

  const getEventById = eventId => {
    return Events.findOne({
      _id: mongoose.Types.ObjectId(eventId)
    }).exec();
  };

  const getAllEvents = () => {
    return Events.find({}).exec();
  };

  const setUserDepartment = (userTelegramId, departmentId) => {
    return Users.findOneAndUpdate(
      { id_telegram: userTelegramId },
      { $set: { department: new mongoose.Types.ObjectId(departmentId) } }
    ).exec();
  };

  return { getUserByTelegramId, getEventById, getAllEvents, setUserDepartment };
}

module.exports = DBController();
