const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventReserveSchema = new Schema({
  //  id события
  eventId: {
    type: String,
    required: true
  },
  //  запасные пользователи
  users: {
    type: Array,
    required: true
  }
});

module.exports = modelName => mongoose.model(modelName, eventReserveSchema);
