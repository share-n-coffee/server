/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');
const Users = require('./models/user.js');
const Events = require('./models/event.js');
const Departments = require('./models/department.js');

class DBController {
  getAllUsers() {
    return Users.find({}).exec();
  }

  getUserByTelegramId(id) {
    return Users.findOne({ telegramUserId: id }).exec();
  }

  getEventById(eventId) {
    return Events.findOne({
      _id: mongoose.Types.ObjectId(eventId)
    }).exec();
  }

  getDepartmentById(departmentId) {
    return Departments.findOne({
      _id: mongoose.Types.ObjectId(departmentId)
    }).exec();
  }

  getAllEvents() {
    return Events.find({}).exec();
  }

  getAllDepartments() {
    return Departments.find({}).exec();
  }

  putUserDepartment(userTelegramId, departmentId) {
    return Users.findOneAndUpdate(
      { telegramUserId: userTelegramId },
      { $set: { department: departmentId } },
      { useFindAndModify: false, new: true },
      (err, data) => data
    );
  }

  postNewDepartment(department) {
    const newDepartment = new Departments(department);

    return new Promise((resolve, reject) => {
      newDepartment.save((err, addedDepartment) => {
        if (err) reject(err);
        resolve(addedDepartment);
      });
    });
  }
}

module.exports = new DBController();
