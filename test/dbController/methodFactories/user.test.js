/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const config = require('../../../server/config/config');
const DBController = require('../../../server/database/dbController');
const connectTestDatabase = require('./../lib/connectTestDatabase');
const usersBackup = require('../collectionBackups/users.json');
const cloneObject = require('./../lib/cloneObject');

const testMongoUri =
  'mongodb://demoman:wgforge1@ds261716.mlab.com:61716/test-db';
connectTestDatabase(testMongoUri);

const controller = new DBController('user');
const testData = {
  userTelegramId: undefined,
  eventId: undefined,
  departmentId: undefined
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
    controller.getAllUsers().then(controllerAllUsers => {
      expect(controllerAllUsers).toHaveLength(usersBackup.length);
      usersBackup.forEach((user, i) => {
        expect(user).toEqual(usersBackup[i]);
      });
      done();
    });
  });

  test('getUserByUserId works', done => {
    const userId = '5ce5b8797247dc3860f0a746';
    controller.getUserByUserId(userId).then(controllerUser => {
      expect(controllerUser).toEqual(usersBackup[0]);
      done();
    });
  });

  test('getUserByTelegramId works', done => {
    const userTelegramId = usersBackup[2]['telegramId'];
    controller.getUserByTelegramId(userTelegramId).then(controllerUser => {
      expect(cloneObject(controllerUser)).toEqual(usersBackup[2]);
      done();
    });
  });

  const newUser = {
    first_name: 'Pedro',
    last_name: 'Rodrigez',
    id: 9876543210,
    photo_url: 'http://www.cnn.com',
    username: 'pedro17'
  };

  test('createNewUser works', done => {
    const mongoPropertyNames = {
      first_name: 'firstName',
      last_name: 'lastName',
      id: 'telegramId',
      photo_url: 'avatar',
      username: 'username'
    };
    const userProps = Object.keys(newUser);
    controller.createNewUser(newUser).then(user => {
      const newMongoUser = cloneObject(user);
      userProps.forEach(property => {
        const mongoProperty = mongoPropertyNames[property];
        expect(newMongoUser[mongoProperty]).toEqual(newUser[property]);
        done();
      });
    });
  });
});
