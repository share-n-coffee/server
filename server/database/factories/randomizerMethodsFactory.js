const EventPairsSchema = require('../models/eventPairs');
const EventReserveSchema = require('../models/eventReserve');
const isNull = require('../../utilities/isNull');

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
    return EventPairs.insertMany(eventPairsObj, (err, data) =>
      console.log('Данные добавлены')
    );
  };

  const removeEventPairs = () => {
    return EventPairs.deleteMany({}, (err, data) =>
      console.log('Данные удалены')
    );
  };

  const getEventPairsById = id => {
    return EventPairs.findOne({ eventId: id }).exec();
  };

  return {
    updateEventPairs,
    insertEventPairs,
    removeEventPairs,
    getEventPairsById
  };
}

module.exports = randomizerMethodsFactory;
