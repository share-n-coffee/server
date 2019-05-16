const mongoose = require('mongoose');
// const mongoose = require('mongoose').set('debug', true);

const UserSchema = require('./../database/models/user');
const EventSchema = require('./../database/models/event');
const DepartmentSchema = require('./../database/models/department');
const EventPairsSchema = require('./models/eventPairs');
const EventReserveSchema = require('./models/eventReserve');

class DBController {
  constructor(
    userModel = 'demo_user',
    eventModel = 'demo_event',
    departmentModel = 'demo_department',
    eventPairsModel = 'demo_eventPair',
    eventReserveModel = 'demo_eventReserve'
  ) {
    this.Users = UserSchema(userModel);
    this.Events = EventSchema(eventModel);
    this.Departments = DepartmentSchema(departmentModel);
    this.EventPairs = EventPairsSchema(eventPairsModel);
    this.EventReserves = EventReserveSchema(eventReserveModel);
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

  getAllEvents() {
    return this.Events.find({}).exec();
  }

  getEventById(eventId) {
    return this.Events.findOne({
      _id: mongoose.Types.ObjectId(eventId)
      // _id: eventId
    }).exec();
  }

  getDepartmentById(departmentId) {
    return this.Departments.findOne({
      _id: mongoose.Types.ObjectId(departmentId)
    }).exec();
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

  // методы для Рандомайзера //
  updateEventPairs(eventPairsObj) {
    const newEventPairsObj = new this.EventPairs(eventPairsObj);

    return new Promise((resolve, reject) => {
      newEventPairsObj.save((err, addedEventPairs) => {
        if (err) reject(err);
        resolve(addedEventPairs);
      });
    });
  }

  insertEventPairs(eventPairsObj) {
    return this.EventPairs.insertMany(eventPairsObj, (err, data) =>
      console.log('Данные добавлены')
    );
  }

  removeEventPairs() {
    return this.EventPairs.deleteMany({}, (err, data) =>
      console.log('Данные удалены')
    );
  }
}

module.exports = DBController;
