const mongoose = require('mongoose');
const EventSchema = require('./../../database/models/event');
const isUndefined = require('./isUndefined');

function eventMethodsFactory(eventModelName) {
  if (isUndefined(eventModelName)) {
    return {};
  }
  const Events = EventSchema(eventModelName);

  const getAllEvents = () => {
    return Events.find({}).exec();
  };

  const getEventById = eventId => {
    return Events.findOne({
      _id: mongoose.Types.ObjectId(eventId)
      // _id: eventId
    }).exec();
  };

  return {
    getAllEvents,
    getEventById
  };
}

module.exports = eventMethodsFactory;
