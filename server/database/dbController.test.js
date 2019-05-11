const mongoose = require('mongoose');
const connectDatabase = require('../lib/connectDatabase.js');
const demoUsers = require('./models/demo/user.js');
const demoEvents = require('./models/demo/event.js');
const demoDepartments = require('./models/demo/department.js');
const controller = require('./dbController.js');

const testData = {
  userTelegramId: undefined,
  eventId: undefined
};

connectDatabase();

describe('dbController tests', () => {
  it('config test', () => {
    expect(controller).toBeTruthy();
  });

  test('Get all Events', done => {
    function cb(data) {
      // eslint-disable-next-line dot-notation
      testData.eventId = data[0]['_id'];
      expect(data).toHaveLength(5);
      done();
    }

    controller.getAllEvents().then(events => {
      cb(events);
    });
  });

  test('Get all Users', done => {
    function cb(data) {
      testData.userTelegramId = data[0].telegramUserId;

      expect(data).toHaveLength(20);
      done();
    }

    controller.getAllUsers().then(users => {
      cb(users);
    });
  });

  test('Get all Departments', done => {
    function cb(data) {
      expect(data).toHaveLength(5);
      done();
    }

    controller.getAllDepartments().then(department => {
      cb(department);
    });
  });

  test('GET User by telegram id', done => {
    function cb(user) {
      expect(user).toHaveProperty('username');
      done();
    }

    controller.getUserByTelegramId(testData.userTelegramId).then(user => {
      cb(user);
    });
  });

  test('GET Event by _id', done => {
    function cb(event) {
      expect(event).toHaveProperty('description');
      done();
    }

    controller.getEventById(testData.eventId).then(event => {
      cb(event);
    });
  });
});
