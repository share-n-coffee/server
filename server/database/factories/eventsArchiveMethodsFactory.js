const ArchiveSchema = require('../models/archive');
const isNull = require('../../utilities/isNull');

function eventsArchiveMethodsFactory(modelNames) {
  if (isNull(modelNames)) {
    return {};
  }
  const Archive = ArchiveSchema(modelNames);

  const addEventToArchive = eventObj => {
    const newArchive = new Archive({
      _id: eventObj.id,
      topicId: eventObj.topicId,
      participants: eventObj.participants,
      date: eventObj.date
    });

    return new Promise((resolve, reject) => {
      newArchive.save((err, addedEvent) => {
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
