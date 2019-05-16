const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventPairsSchema = new Schema({
  //  id события
  eventId: {
    type: String,
    required: true
  },
  //  cгенерированные пары
  pairs: [
    {
      invitedUser1: { type: Number, required: true },
      invitedUser2: { type: Number, required: true },
      event: {}
    }
  ]
});

module.exports = modelName => mongoose.model(modelName, eventPairsSchema);
