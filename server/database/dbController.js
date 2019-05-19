const userMethodsFactory = require('./factories/userMethodsFactory');
const eventMethodsFactory = require('./factories/eventMethodsFactory');
const departmentMethodsFactory = require('./factories/departmentMethodsFactory');
const randomizerMethodsFactory = require('./factories/randomizerMethodsFactory');
const collectionConfig = require('./collection');

function DBController(...collectionNames) {
  const methodNames = ['user', 'event', 'department', 'randomizer'];
  let collections;
  if (arguments.length === 0) {
    collections = methodNames;
  } else {
    collections = collectionNames;
  }

  const switchFactory = collectionName => {
    switch (collectionName) {
      case 'user':
        return userMethodsFactory(collectionConfig.users);
      case 'event':
        return eventMethodsFactory(collectionConfig.events);
      case 'department':
        return departmentMethodsFactory(collectionConfig.departments);
      case 'randomizer':
        return randomizerMethodsFactory({
          eventPairs: collectionConfig.eventPairs,
          eventReserve: collectionConfig.eventReserve
        });
      default:
        return {};
    }
  };

  return collections.reduce((result, collection) => {
    if (typeof collection !== 'string') {
      throw new TypeError('DBController argument should be a strind');
    }
    if (!methodNames.includes(collection)) {
      throw SyntaxError(`arguments should be from list: ${methodNames}`);
    }
    return Object.assign(result, switchFactory(collection));
  }, {});
}

module.exports = DBController;
