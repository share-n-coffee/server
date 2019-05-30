const userMethodsFactory = require('./factories/userMethodsFactory');
const topicMethodsFactory = require('./factories/topicMethodsFactory');
const departmentMethodsFactory = require('./factories/departmentMethodsFactory');
const eventMethodsFactory = require('./factories/eventMethodsFactory');
const subscriptionMethodsFactory = require('./factories/subscriptionMethodsFactory');
const substitutionMethodsFactory = require('./factories/substitutionMethodsFactory');
const logMethodsFactory = require('./factories/logMethodsFactory');
const eventsArchiveMethodsFactory = require('./factories/eventsArchiveMethodsFactory');
const collectionConfig = require('./collection');

function DBController(...collectionNames) {
  const methodNames = [
    'user',
    'topic',
    'department',
    'event',
    'subscription',
    'substitution',
    'log',
    'archive'
  ];
  let collections;
  if (collectionNames.length === 0) {
    collections = methodNames;
  } else {
    collections = collectionNames;
  }

  const factorySwitcher = collectionName => {
    switch (collectionName) {
      case 'user':
        return userMethodsFactory(collectionConfig.user);
      case 'topic':
        return topicMethodsFactory(collectionConfig.topic);
      case 'department':
        return departmentMethodsFactory(collectionConfig.departments);
      case 'event':
        return eventMethodsFactory(collectionConfig.event);
      case 'subscription':
        return subscriptionMethodsFactory(collectionConfig.subscription);
      case 'substitution':
        return substitutionMethodsFactory(collectionConfig.substitution);
      case 'log':
        return logMethodsFactory(collectionConfig.log);
      case 'archive':
        return eventsArchiveMethodsFactory(collectionConfig.archive);
      default:
        return {};
    }
  };

  return collections.reduce((result, collection) => {
    if (typeof collection !== 'string') {
      throw new TypeError('DBController argument should be a string');
    }
    if (!methodNames.includes(collection)) {
      throw SyntaxError(`arguments should be from list: ${methodNames}`);
    }
    return Object.assign(result, factorySwitcher(collection));
  }, {});
}

module.exports = DBController;
