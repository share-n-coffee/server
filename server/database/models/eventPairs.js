const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventPairsSchema = new Schema({
  //  id события
  eventId: {
    type: String,
    required: true
  },
  //  cгенерированные пары
  pairs: {
    type: Array,
    required: true
  }
});

module.exports = modelName => mongoose.model(modelName, eventPairsSchema);
