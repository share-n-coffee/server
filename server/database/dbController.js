const mongoose = require('mongoose');
const Users = require('./models/user.js');
const Events = require('./models/event.js');
const Departments = require('./models/department.js');

function DBController() {
  const getAllUsers = () => {
    return Users.find({}).exec();
  };

  const getUserByTelegramId = id => {
    return Users.findOne({ telegramUserId: id }).exec();
  };

  const getEventById = eventId => {
    return Events.findOne({
      _id: mongoose.Types.ObjectId(eventId)
    }).exec();
  };

  const getDepartmentById = departmentId => {
    return Departments.findOne({
      _id: mongoose.Types.ObjectId(departmentId)
    }).exec();
  };

  const getAllEvents = () => {
    return Events.find({}).exec();
  };

  const getAllDepartments = () => {
    return Departments.find({}).exec();
  };

  const putUserDepartment = (userTelegramId, departmentId) => {
    return Users.findOneAndUpdate(
      { telegramUserId: userTelegramId },
      { $set: { department: departmentId } },
      { useFindAndModify: false, new: true },
      (err, data) => data
    );
  };

  const postNewDepartment = department => {
    const newDepartment = new Departments(department);

    return new Promise((resolve, reject) => {
      newDepartment.save((err, addedDepartment) => {
        if (err) reject(err);
        resolve(addedDepartment);
      });
    });
  };

  return {
    getUserByTelegramId,
    getEventById,
    getAllEvents,
    getAllDepartments,
    putUserDepartment,
    getAllUsers,
    postNewDepartment,
    getDepartmentById
  };
}

module.exports = DBController();
