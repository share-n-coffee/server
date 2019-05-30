/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const createTestDatabase = require('./lib/createTestDatabase');
const connectTestDatabase = require('./lib/connectTestDatabase');
const databaseConfig = require('./../../server/database/collection.json');
const ClassController = require('../../server/database/dbController');

const testMongoUri =
  'mongodb://demoman:wgforge1@ds261716.mlab.com:61716/test-db';
// const folder = './../../collectionBackups/';
const projectName = databaseConfig.project;
const collections = Object.values(databaseConfig)
  .filter(value => value !== projectName)
  .map(collection => collection.concat('s'));

createTestDatabase(testMongoUri, 'test-db', collections);
// connectTestDatabase(testMongoUri);
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
const eventMethods = [
  'getAllEvents',
  'getEventById',
  'postNewEvent',
  'updateEvent'
];
const departmentMethods = [
  'getDepartmentById',
  'getAllDepartments',
  'postNewDepartment',
  'updateDepartment'
];
const randomizerMethods = [
  'updateEventPairs',
  'insertEventPairs',
  'removeEventPairByEventId',
  'getEventPairsById',
  'insertPair',
  'removePair'
];

const controller = new ClassController();
const testData = {
  userTelegramId: undefined,
  eventId: undefined,
  departmentId: undefined
};

describe('dbController tests', () => {
  it('config test', () => {
    expect(controller).toBeTruthy();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log('tests done, May the Force be with you young Jedi');
  });

  test('Has all methods in default case', done => {
    const controllerMethods = Object.keys(controller).sort();
    const testMethods = userMethods
      .concat(eventMethods, departmentMethods, randomizerMethods)
      .sort();
    expect(controllerMethods.length).toEqual(testMethods.length);

    controllerMethods.forEach(method => {
      expect(testMethods.includes(method)).toBeTruthy();
    });
    done();
  });
});

describe('dbController tests with "user" argument passed in', () => {
  const userController = new ClassController('user');
  const controllerMethods = Object.keys(userController);
  it('config test', () => {
    expect(userController).toBeTruthy();
  });

  test('Has valid quantity of user methods', done => {
    expect(controllerMethods.length).toEqual(userMethods.length);
    done();
  });

  test('Has all user methods', done => {
    userMethods.forEach(method => {
      expect(userController).toHaveProperty(method);
    });
    done();
  });

  test('Has no event methods', done => {
    eventMethods.forEach(method => {
      expect(userController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has no department methods', done => {
    departmentMethods.forEach(method => {
      expect(userController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has no randomizer methods', done => {
    randomizerMethods.forEach(method => {
      expect(userController).not.toHaveProperty(method);
    });
    done();
  });
});

describe('dbController tests with "event" argument passed in', () => {
  const eventController = new ClassController('event');
  const controllerMethods = Object.keys(eventController);
  it('config test', () => {
    expect(eventController).toBeTruthy();
  });

  test('Has valid quantity of event methods', done => {
    expect(controllerMethods.length).toEqual(eventMethods.length);
    done();
  });

  test('Has no user methods', done => {
    userMethods.forEach(method => {
      expect(eventController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has all event methods', done => {
    eventMethods.forEach(method => {
      expect(eventController).toHaveProperty(method);
    });
    done();
  });

  test('Has no department methods', done => {
    departmentMethods.forEach(method => {
      expect(eventController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has no randomizer methods', done => {
    randomizerMethods.forEach(method => {
      expect(eventController).not.toHaveProperty(method);
    });
    done();
  });
});

describe('dbController tests with "department" argument passed in', () => {
  const departmentController = new ClassController('department');
  const controllerMethods = Object.keys(departmentController);
  it('config test', () => {
    expect(departmentController).toBeTruthy();
  });

  test('Has valid quantity of department methods', done => {
    expect(controllerMethods.length).toEqual(departmentMethods.length);
    done();
  });

  test('Has no user methods', done => {
    userMethods.forEach(method => {
      expect(departmentController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has no event methods', done => {
    eventMethods.forEach(method => {
      expect(departmentController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has all department methods', done => {
    departmentMethods.forEach(method => {
      expect(departmentController).toHaveProperty(method);
    });
    done();
  });

  test('Has no randomizer methods', done => {
    randomizerMethods.forEach(method => {
      expect(departmentController).not.toHaveProperty(method);
    });
    done();
  });
});

describe('dbController tests with "randomizer" argument passed in', () => {
  const randomizerController = new ClassController('randomizer');
  const controllerMethods = Object.keys(randomizerController);
  it('config test', () => {
    expect(randomizerController).toBeTruthy();
  });

  test('Has valid quantity of randomizer methods', done => {
    expect(controllerMethods.length).toEqual(randomizerMethods.length);
    done();
  });

  test('Has no user methods', done => {
    userMethods.forEach(method => {
      expect(randomizerController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has no event methods', done => {
    eventMethods.forEach(method => {
      expect(randomizerController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has no department methods', done => {
    departmentMethods.forEach(method => {
      expect(randomizerController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has all randomizer methods', done => {
    randomizerMethods.forEach(method => {
      expect(randomizerController).toHaveProperty(method);
    });
    done();
  });
});

describe('dbController tests with plural arguments passed in', () => {
  const departmentController = new ClassController('user', 'department');
  it('config test', () => {
    expect(departmentController).toBeTruthy();
  });

  test('Has user methods', done => {
    userMethods.forEach(method => {
      expect(departmentController).toHaveProperty(method);
    });
    done();
  });

  test('Has no event methods', done => {
    eventMethods.forEach(method => {
      expect(departmentController).not.toHaveProperty(method);
    });
    done();
  });

  test('Has department methods', done => {
    departmentMethods.forEach(method => {
      expect(departmentController).toHaveProperty(method);
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
