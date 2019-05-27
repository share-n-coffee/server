const EventSchema = require('../models/event');
const isNull = require('../../utilities/isNull');

function eventsArchiveMethodsFactory(modelNames) {
  if (isNull(modelNames)) {
    return {};
  }
  const Event = EventSchema(modelNames);

  const addEventToArchive = eventObj => {
    const newEvent = new Event(eventObj);

    return new Promise((resolve, reject) => {
      newEvent.save((err, addedEvent) => {
        if (err) reject(err);
        resolve(addedEvent);
      });
    });
  };

  return {
    addEventToArchive
  };
}

module.exports = eventsArchiveMethodsFactory;
