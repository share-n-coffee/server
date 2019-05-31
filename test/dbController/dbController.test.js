/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const createTestDatabase = require('./lib/createTestDatabase');
const connectTestDatabase = require('./lib/connectTestDatabase');
const databaseConfig = require('./../../server/database/collection.json');
const ClassController = require('../../server/database/dbController');

/*
const testMongoUri =
  'mongodb://demoman:wgforge1@ds261716.mlab.com:61716/test-db';
// const folder = './../../collectionBackups/';
const projectName = databaseConfig.project;
const collections = Object.values(databaseConfig)
  .filter(value => value !== projectName)
  .map(collection => collection.concat('s'));

createTestDatabase(testMongoUri, 'test-db', collections);

*/

// connectTestDatabase(testMongoUri);
const methodNames = [
  'user',
  'topic',
  'event',
  'department',
  'subscription',
  'substitution',
  'log'
].sort();
const userMethods = [
  'getAllUsers',
  'getAllUsersByEventId',
  'findUsers',
  'getUserByUserId',
  'getUserByTelegramId',
  'createNewUser',
  'updateUserInfoByUserId',
  'removeUserByUserId',
  'putUserEventByUserId',
  'getAllUserEventsByUserId',
  'removeUserEventByUserId',
  'removeAllUserEventsByUserId',
  'setUserDepartmentByUserId',
  'getUserDepartmentByUserId',
  'banUserByUserId',
  'unbanUserByUserId',
  'assignAdminByUserId',
  'dischargeAdminByUserId',
  'findOneUser',
  'updateUser',
  'assignSuperAdminByUserId',
  'getAdminPropertiesByUserId',
  'countUsers'
].sort();
const eventMethods = [
  'getEventsByTopicId',
  'removeEventByEventId',
  'getEventById',
  'addEvent',
  'getAllEvents',
  'addParticipant',
  'removeParticipant',
  'getDateByEventId',
  'findEvents',
  'findOneEvent',
  'getAllUsersByEvent',
  'setUserStatusByEventId',
  'setNotificationDateByEventId',
  'getUserStatusByEventId',
  'countEvents'
].sort();
const topicMethods = [
  'getAllTopics',
  'getTopicById',
  'postNewTopic',
  'updateTopic',
  'makeTopicActive',
  'makeTopicInactive',
  'changeCyclicProp',
  'setLastEventsCreationDate',
  'updateLastEventsCreationDate',
  'getLastEventsCreationDate',
  'findTopics',
  'findOneTopic',
  'countTopics'
].sort();
const departmentMethods = [
  'getDepartmentById',
  'getAllDepartments',
  'postNewDepartment',
  'updateDepartment',
  'findDepartments',
  'findOneDepartment',
  'countDepartments',
  'deleteDepartment'
].sort();
const subscriptionMethods = [
  'findSubscriptions',
  'createSubscription',
  'getAllSubscriptionsByTopicId',
  'getAllSubscriptionsByUserId',
  'getAllSubscriptions',
  'removeSubscription',
  'getVisitsRemainedQuantity',
  'setVisitsRemainedQuantity'
].sort();
const substitutionMethods = [
  'addEventForSubstitution',
  'removeSubstitutedEvent',
  'getAllEventsForSubstitution'
].sort();
const logMethods = [
  'postNewLog',
  'getAllLogs',
  'getLogsByUserId',
  'getLogsByType'
].sort();

const archiveEventMethods = ['addEventToArchive'];

const controller = new ClassController();
const userController = new ClassController('user');
const topicController = new ClassController('topic');
const eventController = new ClassController('event');
const departmentController = new ClassController('department');
const subscriptionController = new ClassController('subscription');
const substitutionController = new ClassController('substitution');
const logController = new ClassController('log');
const archiveEventController = new ClassController('archive');

const testData = {
  userTelegramId: undefined,
  eventId: undefined,
  departmentId: undefined
};

const controllerMethods = Object.keys(controller).sort();
const testMethodNames = []
  .concat(
    userMethods,
    topicMethods,
    eventMethods,
    departmentMethods,
    subscriptionMethods,
    substitutionMethods,
    logMethods,
    archiveEventMethods
  )
  .sort();

describe('dbController tests', () => {
  it('config test', () => {
    expect(controller).toBeTruthy();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log('tests done, May the Force be with you young Jedi');
  });

  test('Has all methods in default case', done => {
    expect(controllerMethods).toHaveLength(testMethodNames.length);
    done();
  });
  // controllerMethods.forEach((method, i) => {
  //   // expect(testMethods.includes(method)).toBeTruthy();
  //   expect(method).toEqual(allTestMethods[i]);
  // });
});

describe('Controller has proper methods quantity', () => {
  const userControllerMethods = Object.keys(userController).sort();
  const topicControllerMethods = Object.keys(topicController).sort();
  const eventControllerMethods = Object.keys(eventController).sort();
  const departmentControllerMethods = Object.keys(departmentController).sort();
  const subscriptionControllerMethods = Object.keys(
    subscriptionController
  ).sort();
  const substitutionControllerMethods = Object.keys(
    substitutionController
  ).sort();
  const logControllerMethods = Object.keys(logController).sort();
  const archiveEventControllerMethods = Object.keys(
    archiveEventController
  ).sort();

  // user
  test('User controller has proper methods quantity', done => {
    expect(userControllerMethods).toHaveLength(userMethods.length);
    done();
  });

  test('User controller has all user methods', done => {
    userMethods.forEach(method => {
      expect(userController).toHaveProperty(method);
    });
    done();
  });

  // event
  test('Event controller has proper methods quantity', done => {
    expect(eventControllerMethods).toHaveLength(eventMethods.length);
    done();
  });

  test('Event controller has all event methods', done => {
    eventMethods.forEach(method => {
      expect(eventController).toHaveProperty(method);
    });
    done();
  });

  // topic
  test('Topic controller has proper methods quantity', done => {
    expect(topicControllerMethods).toHaveLength(topicMethods.length);
    done();
  });

  test('Topic controller has all topic methods', done => {
    topicMethods.forEach(method => {
      expect(topicController).toHaveProperty(method);
    });
    done();
  });

  // department
  test('Department controller has proper methods quantity', done => {
    expect(departmentControllerMethods).toHaveLength(departmentMethods.length);
    done();
  });

  test('Department controller has all department methods', done => {
    departmentMethods.forEach(method => {
      expect(departmentController).toHaveProperty(method);
    });
    done();
  });

  // subscription
  test('Subscription controller has proper methods quantity', done => {
    expect(subscriptionControllerMethods).toHaveLength(
      subscriptionMethods.length
    );
    done();
  });

  test('Subscription controller has all subscription methods', done => {
    subscriptionMethods.forEach(method => {
      expect(subscriptionController).toHaveProperty(method);
    });
    done();
  });

  // substitution
  test('Substitution controller has proper methods quantity', done => {
    expect(substitutionControllerMethods).toHaveLength(
      substitutionMethods.length
    );
    done();
  });

  test('Substitution controller has all substitution methods', done => {
    substitutionMethods.forEach(method => {
      expect(substitutionController).toHaveProperty(method);
    });
    done();
  });

  // log
  test('Log controller has proper methods quantity', done => {
    expect(logControllerMethods).toHaveLength(logMethods.length);
    done();
  });

  test('Log controller has all log methods', done => {
    logMethods.forEach(method => {
      expect(logController).toHaveProperty(method);
    });
    done();
  });

  // archive
  test('Archive event controller has proper methods quantity', done => {
    expect(archiveEventControllerMethods).toHaveLength(
      archiveEventMethods.length
    );
    done();
  });

  test('Archive event controller has all archive event methods', done => {
    archiveEventMethods.forEach(method => {
      expect(archiveEventController).toHaveProperty(method);
    });
    done();
  });
});

describe('Controller tests with "user", "event" and "log" arguments passed in', () => {
  const controllerUEL = new ClassController('user', 'event', 'log');
  const controllerUELMethods = Object.keys(controllerUEL).sort();
  const expectedUELMethods = []
    .concat(userMethods, eventMethods, logMethods)
    .sort();

  test('Has proper method quantity', done => {
    expect(controllerUELMethods).toHaveLength(expectedUELMethods.length);
    done();
  });

  test('Has all proper methods', done => {
    expectedUELMethods.forEach(method => {
      expect(controllerUEL).toHaveProperty(method);
    });
    done();
  });

  test('Has no topic methods', done => {
    topicMethods.forEach(method => {
      expect(controllerUEL).not.toHaveProperty(method);
    });
    done();
  });

  test('Has no department methods', done => {
    departmentMethods.forEach(method => {
      expect(controllerUEL).not.toHaveProperty(method);
    });
    done();
  });

  test('Has no subscription methods', done => {
    subscriptionMethods.forEach(method => {
      expect(controllerUEL).not.toHaveProperty(method);
    });
    done();
  });

  test('Has no substitution methods', done => {
    substitutionMethods.forEach(method => {
      expect(controllerUEL).not.toHaveProperty(method);
    });
    done();
  });
});

describe("dbController's argument should be a string", () => {
  test('Number as an argument throws TypeError', done => {
    function cb() {
      return new ClassController(42);
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
  test('Array as an argument throws TypeError', done => {
    function cb() {
      return new ClassController([42]);
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
  test('Undefined as an argument throws TypeError', done => {
    function cb() {
      return new ClassController(undefined);
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
  test('Null as an argument throws TypeError', done => {
    function cb() {
      return new ClassController(null);
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
  test('Boolean as an argument throws TypeError', done => {
    function cb() {
      return new ClassController(true);
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
  test('Object as an argument throws TypeError', done => {
    function cb() {
      return new ClassController({
        'Bruce Willis': 'yipikaye, motherf*cker'
      });
    }
    expect(cb).toThrowError(TypeError);
    done();
  });
});

describe('dbController takes wrong string argument', () => {
  test('Should throw SyntaxError', done => {
    function cb() {
      return new ClassController('wg_forge_power!');
    }
    expect(cb).toThrowError(SyntaxError);
    done();
  });
});

describe('dbController takes over 1 argument', () => {
  test('Should throw SyntaxError', done => {
    function cb() {
      return new ClassController('there', 'must', 'be', 'only', 'one');
    }
    expect(cb).toThrowError(SyntaxError);
    done();
  });
});
