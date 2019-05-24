/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const config = require('../../../server/config/config');
// const connectDatabase = require('../../../server/lib/connectDatabase');
const DBController = require('../../../server/database/dbController');
const collection = require('./../../../server/database/collection');
// eslint-disable-next-line import/no-unresolved
const usersComparison = require('../collectionBackups/usersComparison.json');
const copyDatabaseCollection = require('./../../../server/lib/copyDatabaseCollection');

const mongoUri =
  'mongodb://demoman:wgforge1@ds259806.mlab.com:59806/random-coffee';
// JSON.stringify(config.database);
const controller = new DBController('user');
const testData = {
  userTelegramId: undefined,
  eventId: undefined,
  departmentId: undefined
};

mongoose
  .connect(
    mongoUri,
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log('Database is connected');
  })
  .catch(error => {
    console.log(error);
  });

// save user collection in backup file
copyDatabaseCollection(
  mongoUri,
  collection.project,
  collection.user,
  './test/dbController/collectionBackups/users.json'
);

const updateUsersComparison = () => {
  copyDatabaseCollection(
    mongoUri,
    collection.project,
    collection.user,
    './test/dbController/collectionBackups/usersComparison.json'
  );
};

describe('dbController user methods tests', () => {
  it('config test', () => {
    expect(controller).toBeTruthy();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log('tests done, May the Force be with you young Jedi');
  });

  test('getAllUsers works', done => {
    controller.getAllUsers().then(controllerUsers => {
      updateUsersComparison();
      expect(controllerUsers).toHaveLength(usersComparison.length);
      done();
    });
  });

  test('getUserByUserId works', done => {
    updateUsersComparison();
    const userComparison = usersComparison[0];
    const userProperties = Object.keys(userComparison).filter(property => {
      return property !== '_id';
    });
    const userId = userComparison['_id'];
    controller.getUserByUserId(userId).then(controllerUser => {
      userProperties.forEach(property => {
        expect(controllerUser[property]).toEqual(userComparison[property]);
      });
      done();
    });
  });
});
