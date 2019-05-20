/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const config = require('../../../server/config/config');
const connectDatabase = require('../../../server/lib/connectDatabase');
const ClassController = require('../../../server/database/dbController');
// const collectionConfig = require('./collection');

const userMethods = [
  'getAllUsers',
  'getUserById',
  'postNewUser',
  'getAllUsersByEventId',
  'querySearch',
  'putUserBan',
  'saveNewUser',
  'updateUser',
  'setEventStatus'
];

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
      expect(data).toHaveLength(5);
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
          .count((error, mongoUsersCount) => {
            client.close();
            controller.getAllUsers().then(controllerUsers => {
              cb(controllerUsers, mongoUsersCount);
            });
          });
      }
    );
  });

  // test('GET User by telegram id', done => {
  //   function cb(user) {
  //     expect(user).toHaveProperty('username');
  //     done();
  //   }

  //   controller.getUserById(testData.userTelegramId).then(user => {
  //     cb(user);
  //   });
  // });

  test('GET User by _id', done => {
    function cb(user) {
      expect(user).toHaveProperty('username');
      done();
    }

    controller.getUserById(testData.userId).then(user => {
      cb(user);
    });
  });
});
