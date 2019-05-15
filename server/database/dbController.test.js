/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const config = require('./../config/config');
const connectDatabase = require('../lib/connectDatabase.js');
const demoUsers = require('./models/user.js');
const demoEvents = require('./models/event.js');
const demoDepartments = require('./models/department.js');
const ClassController = require('./dbController.js');

const controller = new ClassController();
const testData = {
  userTelegramId: undefined,
  eventId: undefined,
  departmentId: undefined
};

connectDatabase();

describe('dbController tests', () => {
  it('config test', () => {
    expect(controller).toBeTruthy();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log('tests done, May the Force be with you young Jedi');
  });

  test('Get all Events', done => {
    function cb(data) {
      testData.eventId = data[0]['_id'];
      expect(data).toHaveLength(6);
      done();
    }

    controller.getAllEvents().then(events => {
      cb(events);
    });
  });

  test('Get all Users', done => {
    function cb(controllerUsers, mongoUsersCount) {
      testData.userTelegramId = controllerUsers[0].telegramUserId;
      testData.userId = controllerUsers[0]['_id'];
      expect(controllerUsers).toHaveLength(mongoUsersCount);
      done();
    }

    //  Send mongodb driver's query for comparing results
    MongoClient.connect(
      config.database,
      (err, client) => {
        client
          .db('demoproject')
          .collection('demo_users')
          .find({})
          .count((errr, mongoUsersCount) => {
            client.close();
            controller.getAllUsers().then(controllerUsers => {
              cb(controllerUsers, mongoUsersCount);
            });
          });
      }
    );
  });

  test('Get all Departments', done => {
    function cb(data) {
      testData.departmentId = data[0]['_id'];

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

  test('GET User by _id', done => {
    function cb(user) {
      expect(user).toHaveProperty('username');
      done();
    }

    controller.getUserById(testData.userId).then(user => {
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

  test('GET Department by _id', done => {
    function cb(department) {
      expect(department).toHaveProperty('description');
      done();
    }

    controller.getDepartmentById(testData.departmentId).then(department => {
      cb(department);
    });
  });

  test('POST new Department', done => {
    const newDepartmentParams = {
      title: 'New Department',
      description: 'Just another Department'
    };

    function cb(newDepartment) {
      expect(newDepartment.description).toMatch(
        newDepartmentParams.description
      );

      //  Send mongodb driver's query for deleting test Department
      MongoClient.connect(
        config.database,
        (err, client) => {
          client
            .db('demoproject')
            .collection('demo_departments')
            .deleteOne({ _id: newDepartment['_id'] }, () => {
              client.close();
              done();
            });
        }
      );
    }

    controller.postNewDepartment(newDepartmentParams).then(newDepartment => {
      cb(newDepartment);
    });
  });
});
