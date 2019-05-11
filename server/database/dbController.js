/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');
const Users = require('./models/user');
const Events = require('./models/event');
const Departments = require('./models/department');

class DBController {
  getAllUsers() {
    return Users.find({}).exec();
  }

  getUserByTelegramId(id) {
    return Users.findOne({ telegramUserId: id }).exec();
  }

  getUserById(id) {
    return Users.findOne({ _id: id }).exec();
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

  putUserDepartment(id, departmentId) {
    return Users.findOneAndUpdate(
      { _id: id },
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
