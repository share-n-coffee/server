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

const controller = new ClassController('user');
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

  test('GET User by _id', done => {
    function cb(user) {
      expect(user).toHaveProperty('username');
      done();
    }

    controller.getUserById(testData.userId).then(user => {
      cb(user);
    });
  });
  /*
  test('Query search', done => {
    const query = { department: '5cd6f6c381371d297acb2fd3' };
    const fields = { firstName: 1, lastName: 1 };
    function cb(controllerUser, mongoUser) {
      expect(controllerUser).toEqual(mongoUser);
      done();
    }

    MongoClient.connect(
      config.database,
      (err, client) => {
        client
          .db('demoproject')
          .collection('demo_users')
          .find(query, fields, (error, mongoUser) => {
            client.close();
            controller.querySearch(query, fields).then(controllerUser => {
              cb(controllerUser, mongoUser);
            });
          });
      }
    );
  });
  */
});
