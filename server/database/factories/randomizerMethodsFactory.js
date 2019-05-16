const EventPairsSchema = require('../models/eventPairs');
const EventReserveSchema = require('../models/eventReserve');
const isNull = require('./isNull');

function randomizerMethodsFactory(modelNames) {
  if (isNull(modelNames)) {
    return {};
  }
  const EventPairs = EventPairsSchema(modelNames.eventPairs);
  const EventReserve = EventReserveSchema(modelNames.eventReserve);

  // методы для Рандомайзера //
  const updateEventPairs = eventPairsObj => {
    const newEventPairsObj = new this.EventPairs(eventPairsObj);

    return new Promise((resolve, reject) => {
      newEventPairsObj.save((err, addedEventPairs) => {
        if (err) reject(err);
        resolve(addedEventPairs);
      });
    });
  };

  const insertEventPairs = eventPairsObj => {
    return this.EventPairs.insertMany(eventPairsObj, (err, data) =>
      console.log('Данные добавлены')
    );
  };

  const removeEventPairs = () => {
    return this.EventPairs.deleteMany({}, (err, data) =>
      console.log('Данные удалены')
    );
  };

  return { updateEventPairs, insertEventPairs, removeEventPairs };
}

module.exports = randomizerMethodsFactory;
