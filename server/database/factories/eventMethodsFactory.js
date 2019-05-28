const EventSchema = require('../models/event');
const isNull = require('../../utilities/isNull');

function eventMethodsFactory(modelNames) {
  if (isNull(modelNames)) {
    return {};
  }
  const Events = EventSchema(modelNames);

  const findEvents = req =>
    Events.find(req.query, req.fields, {
      ...req.sorting,
      ...req.pagination
    });

  const findOneEvent = (query, fields = null) =>
    Events.findOne(query, fields).exec();

  const countEvents = () => Events.find({}).count();

  // новые методы //
  const addEvent = (topicID, dateTimestamp) => {
    const newEvent = new Events({
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
    return Events.find({}, (err, data) => {
      if (err) {
        console.log(err);
      }
    }).exec();
  };

  const addParticipant = (eventID, userID) => {
    return Events.findOneAndUpdate(
      { _id: eventID },
      { $push: { participants: { userId: userID } } },
      { useFindAndModify: false, new: true }
    );
  };

  const removeParticipant = (eventID, userID) => {
    return Events.findOneAndUpdate(
      { _id: eventID },
      { $pull: { participants: { userId: userID } } },
      { useFindAndModify: false, new: true }
    );
  };

  const getEventById = _id => {
    return Events.findOne({ _id }).exec();
  };
  const getDateByEventId = eventId => {
    return Events.findOne({ _id: eventId }, 'date').exec();
  };
  const getAllUsersByEvent = eventId => {
    return Events.findOne(
      { _id: eventId },
      { 'participants.userId': true, _id: false }
    ).exec();
  };
  const setUserStatusByEventId = (eventId, userID, stat) => {
    return Events.updateOne(
      { _id: eventId, 'participants.userId': userID },
      { $set: { 'participants.$.status': stat } },
      err => {
        if (err) console.log(err);
      }
    ).exec();
  };
  const getUserStatusByEventId = (eventId, userId) => {
    return Events.findOne(
      { _id: eventId },
      { participants: { $elemMatch: { userId } } },
      err => {
        if (err) console.log(err);
      }
    ).exec();
  };
  const removeEventByEventId = _id => {
    return Events.deleteOne({ _id }, err => {
      if (err) console.log(err);
    });
  };
  const getEventsByTopicId = topicId => {
    return Events.find({ topicId }, err => {
      if (err) console.log(err);
    }).exec();
  };
  // ------------ //

  return {
    getEventsByTopicId,
    removeEventByEventId,
    getEventById,
    addEvent,
    getAllEvents,
    addParticipant,
    removeParticipant,
    getDateByEventId,
    findEvents,
    findOneEvent,
    getAllUsersByEvent,
    setUserStatusByEventId,
    getUserStatusByEventId,
    countEvents
  };
}

module.exports = eventMethodsFactory;
