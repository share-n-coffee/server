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

  const findEvents = req =>
    Events.find(req.query, req.fields, { ...req.sorting });

  const findOneEvent = (query, fields = null) =>
    Events.findOne(query, fields).exec();

  const getEventById = eventId => {
    return Events.findOne({
      _id: mongoose.Types.ObjectId(eventId)
    }).exec();
  };

  // новые методы //
  const addEvent = (topicID, dateTimestamp) => {
    const newEvent = new EventSchema({
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
    })
      .lean()
      .exec();
  };

  const addParticipant = (eventID, userID) => {
    return Event.findOneAndUpdate(
      { _id: eventID },
      { $push: { participants: { userId: userID } } },
      { useFindAndModify: false, new: true }
    );
  };

  const removeParticipant = (eventID, userID) => {
    return Event.findOneAndUpdate(
      { _id: eventID },
      { $pull: { participants: { userId: userID } } },
      { useFindAndModify: false, new: true }
    );
  };

  const getEventById = _id => {
    return Event.findOne({ _id })
      .lean()
      .exec();
  };
  const getDateByEventId = eventId => {
    return Event.findOne({ _id: eventId }, 'date')
      .lean()
      .exec();
  };
  const getAllUsersByEventId = eventId => {
    return Event.findOne(
      { _id: eventId },
      { 'participants.userId': true, _id: false }
    )
      .lean()
      .exec();
  };
  const setUserStatusByEventId = (eventId, userID, stat) => {
    return Event.updateOne(
      { _id: eventId, 'participants.userId': userID },
      { $set: { 'participants.$.status': stat } },
      err => {
        if (err) console.log(err);
      }
    ).exec();
  };
  const removeEventByEventId = _id => {
    return Event.deleteOne({ _id }, err => {
      if (err) console.log(err);
    });
  };
  const getEventsByTopicId = topicId => {
    return Event.find({ topicId }, err => {
      if (err) console.log(err);
    })
      .lean()
      .exec();
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
    getAllUsersByEvent,
    setUserStatusByEvent,
    findEvents,
    findOneEvent,
    getAllUsersByEventId,
    setUserStatusByEventId
  };
}

module.exports = eventMethodsFactory;
