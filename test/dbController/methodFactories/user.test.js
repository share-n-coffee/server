/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const config = require('../../../server/config/config');
// const connectDatabase = require('../../../server/lib/connectDatabase');
const DBController = require('../../../server/database/dbController');
const collection = require('./../../../server/database/collection');
const usersBackup = require('../collectionBackups/users.json');
const usersComparison = require('../collectionBackups/usersComparison.json');
const copyDatabaseCollection = require('../lib/copyDatabaseCollection');
const cloneObject = require('./../lib/cloneObject');

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
    const userId = userComparison['_id'];
    controller.getUserByUserId(userId).then(controllerUser => {
      expect(cloneObject(controllerUser)).toEqual(userComparison);
      done();
    });
  });

  test('getUserByTelegramId works', done => {
    updateUsersComparison();
    const userComparison = usersComparison[5];
    const { telegramId } = userComparison;
    controller.getUserByTelegramId(telegramId).then(controllerUser => {
      expect(cloneObject(controllerUser)).toEqual(userComparison);
      done();
    });
  });

  const newUser = {
    first_name: 'Petro',
    last_name: 'Poroshenko',
    id: 9876543210,
    photo_url: 'http://www.cnn.com',
    username: 'petka'
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

  updateUsersComparison();
  const lastUser = usersComparison[usersComparison.length - 1];
  const lastUserId = lastUser['_id'];
  // test('putUserEventByUserId works', done => {
  //   const { eventId } = usersComparison[0].events[0];
  //   controller
  //     .putUserEventByUserId(lastUserId, eventId)
  //     .then(controllerEvent => {
  //       console.log('NEW EVENT ADDED>>>> ', cloneObject(controllerEvent)['eventId']);
  //       updateUsersComparison();
  //       const lastUserEvents = lastUser.events;
  //       const lastUserAddedEventId = lastUser[lastUserEvents.length - 1];
  //       expect(lastUserAddedEventId).toEqual(eventId);

  //       done();
  //     });
  // });

  const petkaID = '5ce7f0c99193c9bb5421580f';
  const petkaEvent = '5ce954bf7540c406f8eb837f';
  const petkaEvent2 = '5ce98813ee19931990096be8';
  const petkaTelegram = 9876543210;
  const petkaNewDepId = '5cd6f6c381371d297acb2fd2';
  // controller.putUserEventByUserId(petkaID, petkaEvent).then();
  // controller.putUserEventByUserId(petkaID, petkaEvent2).then();

  // controller.removeUserEventByUserId(petkaID, petkaEvent2).then();
  // controller.removeAllUserEventsByUserId(petkaID).then();

  // controller.getUserDepartmentByUserId(petkaID).then(dep => {
  // console.log('dep:::;', dep);
  // });

  // controller.setUserDepartmentByUserId(petkaID, petkaNewDepId).then();
  // controller.banUserByUserId(petkaID, 66666666).then();
  // controller.unbanUserByUserId(petkaID).then();

  // controller.assignSuperAdminByUserId(petkaID).then();
  // controller.dischargeAdminByUserId(petkaID).then();

  // controller.getAdminPropertiesByUserId(petkaID).then(props => {
  //     console.log('admin props >>>>>',JSON.stringify(props));
  //   }
  // );

  // console.log('last user id>>>>', lastUserId);

  test('getAllUserEventsByUserId works', done => {
    controller
      .getAllUserEventsByUserId('5ce5b8797247dc3860f0a745')
      .then(controllerEvents => {
        controllerEvents.events.forEach(event => {
          console.log('EVENT>>>>>> ', event);
        });
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
