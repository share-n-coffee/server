/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const config = require('../../../server/config/config');
// const connectDatabase = require('../../../server/lib/connectDatabase');
const DBController = require('../../../server/database/dbController');
const collection = require('./../../../server/database/collection');
const subscriptionsBackup = require('./../collectionBackups/subscriptions.json');
const usersComparison = require('./../collectionBackups/subscriptionsComparison.json');
const copyDatabaseCollection = require('../lib/copyDatabaseCollection');
const cloneObject = require('../lib/cloneObject');

const mongoUri =
  'mongodb://demoman:wgforge1@ds259806.mlab.com:59806/random-coffee';
// JSON.stringify(config.database);
const controller = new DBController('subscription');
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
  collection.subscription,
  './test/dbController/collectionBackups/subscriptions.json'
);

const updateUsersComparison = () => {
  copyDatabaseCollection(
    mongoUri,
    collection.project,
    collection.subscription,
    './test/dbController/collectionBackups/subscriptionsComparison.json'
  );
};

describe('dbController subscription methods tests', () => {
  it('config test', () => {
    expect(controller).toBeTruthy();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log('tests done, May the Force be with you young Jedi');
  });

  test('', done => {
    // controller.getAllUsers().then(controllerUsers => {
    done();
  });
});
