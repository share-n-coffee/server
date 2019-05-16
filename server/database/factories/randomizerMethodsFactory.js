const EventPairsSchema = require('../models/eventPairs');
const EventReserveSchema = require('../models/eventReserve');
const isNull = require('./isNull');

function randomizerMethodsFactory(modelNames) {
  if (isNull(modelNames)) {
    return {};
  }
  const EventPairs = EventPairsSchema(modelNames.eventPairs);
  const EventReserve = EventReserveSchema(modelNames.eventReserve);

  const sayHi = () => {
    console.log('Hi, randomizer!');
  };

  return { sayHi };
}

module.exports = randomizerMethodsFactory;
