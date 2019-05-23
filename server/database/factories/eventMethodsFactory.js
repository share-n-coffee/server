const mongoose = require('mongoose');
const EventSchema = require('../models/event');
const isNull = require('../../utilities/isNull');

function eventMethodsFactory(eventModelName) {
  if (isNull(eventModelName)) {
    return {};
  }
  const Events = EventSchema(eventModelName);

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

  const postNewEvent = event => {
    const newEvent = new Events(event);
    return new Promise((resolve, reject) => {
      newEvent.save((err, addedEvent) => {
        if (err) reject(err);
        resolve(addedEvent);
      });
    });
  };

  const updateEvent = (eventId, newProps) => {
    return Events.findOneAndUpdate(
      { _id: eventId },
      { $set: newProps },
      { useFindAndModify: false, new: true },
      (err, data) => data
    );
  };

  return {
    getAllEvents,
    getEventById,
    postNewEvent,
    updateEvent,
    find
  };
}

module.exports = eventMethodsFactory;
