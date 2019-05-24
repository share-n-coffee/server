const EventSchema = require('../models/event');
const isNull = require('../../utilities/isNull');

function eventMethodsFactory(modelNames) {
  if (isNull(modelNames)) {
    return {};
  }
  const Event = EventSchema(modelNames);

  // методы для Рандомайзера //

  const insertEvent = eventObj => {
    const newEvent = new Event(eventObj);

    return new Promise((resolve, reject) => {
      newEvent.save((err, addedEvent) => {
        if (err) reject(err);
        resolve(addedEvent);
      });
      console.log(`Пары к событию ${eventObj.eventId} добавлены.`);
    });
  };

  const removeAllEventByEventId = id => {
    return Event.deleteOne({ eventId: id }, (err, data) =>
      console.log(`Event c Id ${id} удален из Бд(event)`)
    );
  };

  const getEventById = id => {
    return Event.findOne({ eventId: id }).exec();
  };

  const insertPair = (id, pairObject) => {
    return Event.findOneAndUpdate(
      { eventId: id },
      { $push: { pairs: pairObject } },
      { useFindAndModify: false, new: true }
    );
  };

  const removePair = (id, pairId) => {
    return Event.findOneAndUpdate(
      { eventId: id },
      { $pull: { pairs: { _id: pairId } } },
      { useFindAndModify: false, new: true }
    );
  };

  return {
    insertEvent,
    removeAllEventByEventId,
    getEventById,
    insertPair,
    removePair
  };
}

module.exports = eventMethodsFactory;
