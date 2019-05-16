const userMethodsFactory = require('./factories/userMethodsFactory');
const eventMethodsFactory = require('./factories/eventMethodsFactory');
const departmentMethodsFactory = require('./factories/departmentMethodsFactory');
const randomizerMethodsFactory = require('./factories/randomizerMethodsFactory');
const collection = require('./collection');

function DBController(collectionName) {
  if (arguments.length === 0) {
    return Object.assign(
      userMethodsFactory(collection.users),
      eventMethodsFactory(collection.events),
      departmentMethodsFactory(collection.departments),
      randomizerMethodsFactory({
        eventPairs: collection.eventPairs,
        eventReserve: collection.eventReserve
      })
    );
  }
  if (arguments.length === 1) {
    if (typeof collectionName !== 'string') {
      throw new TypeError('DBController argument should be a strind');
    }
    switch (collectionName) {
      case 'user':
        return userMethodsFactory(collection.users);
      case 'event':
        return eventMethodsFactory(collection.events);
      case 'department':
        return departmentMethodsFactory(collection.departments);
      case 'randomizer':
        return randomizerMethodsFactory({
          eventPairs: collection.eventPairs,
          eventReserve: collection.eventReserve
        });
      default:
        throw new TypeError('Argument should be a collection name');
    }
  } else {
    throw new SyntaxError(
      'DBController constructor should have one or none arguments'
    );
  }
}

module.exports = DBController;
