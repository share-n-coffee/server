const userMethodsFactory = require('./factories/userMethodsFactory');
const topicMethodsFactory = require('./factories/topicMethodsFactory');
const departmentMethodsFactory = require('./factories/departmentMethodsFactory');
const eventMethodsFactory = require('./factories/eventMethodsFactory');
const subscriberMethodsFactory = require('./factories/subscriberMethodsFactory');
const substitutionMethodsFactory = require('./factories/substitutionMethodsFactory');
const logMethodsFactory = require('./factories/logMethodsFactory');
const collectionConfig = require('./collection');

function DBController(...collectionNames) {
  const methodNames = [
    'user',
    'topic',
    'department',
    'event',
    'subscriber',
    'substitution',
    'log'
  ];
  let collections;
  if (arguments.length === 0) {
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
      case 'subscriber':
        return subscriberMethodsFactory(collectionConfig.subscriber);
      case 'substitution':
        return substitutionMethodsFactory(collectionConfig.substitution);
      case 'log':
        return logMethodsFactory(collectionConfig.log);
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
    return Object.assign(result, factorySwitcher(collection));
  }, {});
}

module.exports = DBController;
