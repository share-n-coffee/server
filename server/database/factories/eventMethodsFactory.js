const mongoose = require('mongoose');
const EventSchema = require('../models/event');
const isNull = require('../../utilities/isNull');

function eventMethodsFactory(eventModelName) {
  if (isNull(eventModelName)) {
    return {};
  }
  const Events = EventSchema(eventModelName);

  const getAllEvents = () => {
    return Events.find({}).exec();
  };

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
    updateEvent
  };
}

module.exports = eventMethodsFactory;
