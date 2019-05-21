const EventPairsSchema = require('../models/event');
const isNull = require('../../utilities/isNull');

function randomizerMethodsFactory(modelNames) {
  if (isNull(modelNames)) {
    return {};
  }
  const EventPairs = EventPairsSchema(modelNames.eventPairs);

  // методы для Рандомайзера //

  const insertEventPairs = eventPairsObj => {
    const newEventPair = new EventPairs(eventPairsObj);

    return new Promise((resolve, reject) => {
      newEventPair.save((err, addedEventPair) => {
        if (err) reject(err);
        resolve(addedEventPair);
      });
      console.log(`Пары к событию ${eventPairsObj.eventId} добавлены.`);
    });
  };

  const removeAllEventPairsByEventId = id => {
    return EventPairs.deleteOne({ eventId: id }, (err, data) =>
      console.log(`Event c Id ${id} удален из Бд(eventPairs)`)
    );
  };

  const getEventPairsById = id => {
    return EventPairs.findOne({ eventId: id }).exec();
  };

  const insertPair = (id, pairObject) => {
    return EventPairs.findOneAndUpdate(
      { eventId: id },
      { $push: { pairs: pairObject } },
      { useFindAndModify: false, new: true }
    );
  };

  const removePair = (id, pairId) => {
    return EventPairs.findOneAndUpdate(
      { eventId: id },
      { $pull: { pairs: { _id: pairId } } },
      { useFindAndModify: false, new: true }
    );
  };

  return {
    insertEventPairs,
    removeAllEventPairsByEventId,
    getEventPairsById,
    insertPair,
    removePair
  };
}

module.exports = randomizerMethodsFactory;
