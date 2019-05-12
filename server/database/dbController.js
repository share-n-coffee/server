/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');

const UserSchema = require('./../database/models/user');
const EventSchema = require('./../database/models/event');
const DepartmentSchema = require('./../database/models/department');

class DBController {
  constructor(
    userModel = 'demo_User',
    eventModel = 'demo_event',
    departmentModel = 'demo_department'
  ) {
    this.Users = UserSchema(userModel);
    this.Events = EventSchema(eventModel);
    this.Departments = DepartmentSchema(departmentModel);
  }

  getAllUsers() {
    return this.Users.find({}).exec();
  }

  getUserByTelegramId(id) {
    return this.Users.findOne({ telegramUserId: id }).exec();
  }

  getUserById(id) {
    return this.Users.findOne({ _id: id }).exec();
  }

  getEventById(eventId) {
    return this.Events.findOne({
      _id: mongoose.Types.ObjectId(eventId)
    }).exec();
  }

  getDepartmentById(departmentId) {
    return this.Departments.findOne({
      _id: mongoose.Types.ObjectId(departmentId)
    }).exec();
  }

  getAllEvents() {
    return this.Events.find({}).exec();
  }

  getAllDepartments() {
    return this.Departments.find({}).exec();
  }

  putUserDepartment(userId, department) {
    return this.Users.findOneAndUpdate(
      { _id: userId },
      { $set: { department } },
      { useFindAndModify: false, new: true },
      (err, data) => data
    );
  }

  putUserTelegramChatId(userId, telegramChatId) {
    return this.Users.findOneAndUpdate(
      { _id: userId },
      { $set: { telegramChatId } },
      { useFindAndModify: false, new: true },
      (err, data) => data
    );
  }

  postNewDepartment(department) {
    const newDepartment = new this.Departments(department);

    return new Promise((resolve, reject) => {
      newDepartment.save((err, addedDepartment) => {
        if (err) reject(err);
        resolve(addedDepartment);
      });
    });
  }

  postNewUser(user) {
    const newUser = new this.Users(user);

    return new Promise((resolve, reject) => {
      newUser.save((err, addedUser) => {
        if (err) reject(err);
        resolve(addedUser);
      });
    });
  }
}

module.exports = DBController;
