const EventSchema = require('../models/event');
const isNull = require('../../utilities/isNull');

function eventMethodsFactory(modelNames) {
  if (isNull(modelNames)) {
    return {};
  }
  const Event = EventSchema(modelNames);

  // новые методы //
  const addEvent = (topicID, dateTimestamp) => {
    const newEvent = new Event({
      topicId: topicID,
      date: dateTimestamp
    });

    return new Promise((resolve, reject) => {
      newEvent.save((err, addedEvent) => {
        if (err) reject(err);
        resolve(addedEvent);
      });
    });
  };
  const getAllEvents = () => {
    return Event.find({}, (err, data) => {
      if (err) {
        console.log(err);
      }
    }).exec();
  };
  const addParticipant = (eventID, userID) => {
    return Event.findOneAndUpdate(
      { eventId: eventID },
      { $push: { participants: { userId: userID } } },
      { useFindAndModify: false, new: true }
    );
  };
  // ------------ //

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
    removePair,
    addEvent,
    getAllEvents,
    addParticipant
  };
}

module.exports = eventMethodsFactory;
