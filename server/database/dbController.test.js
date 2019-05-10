const mongoose = require('mongoose');
const connectDatabase = require('../lib/connectDatabase.js');
const demoUsers = require('./models/demo/user.js');
const demoEvents = require('./models/demo/event.js');
const demoDepartments = require('./models/demo/department.js');
const controller = require('./dbController.js');

connectDatabase();

describe('dbcontroller tests', () => {
  it('config test', () => {
    expect(controller).toBeTruthy();
  });

  test('Get all Events', done => {
    function callback(data) {
      expect(data.length).toBe(5);
      done();
    }

    controller.getAllEvents().then(events => {
      callback(events);
    });
  });

  test('Get all Users', done => {
    function callback(data) {
      expect(data.length).toBe(20);
      done();
    }

    controller.getAllUsers().then(users => {
      callback(users);
    });
  });

  test('Get all Departments', done => {
    function callback(data) {
      expect(data.length).toBe(5);
      done();
    }

    controller.getAllDepartments().then(department => {
      callback(department);
    });
  });
});
