const mongoose = require('mongoose');
const EventSchema = require('../models/event');
const isNull = require('../../utilities/isNull');

function eventMethodsFactory(modelNames) {
  if (isNull(modelNames)) {
    return {};
  }
  const Events = EventSchema(modelNames);

  const getAllEvents = sorting => {
    return Events.find({}, null, sorting).exec();
  };

  const find = (query, fields = null, sorting = null, skip = 0, limit = 0) =>
    Events.find(query, fields, { ...sorting, skip, limit }).exec();

  const getEventById = eventId => {
    return Events.findOne({
      _id: mongoose.Types.ObjectId(eventId)
    }).exec();
  };

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
    find,
    insertPair,
    removePair
  };
}

module.exports = eventMethodsFactory;
