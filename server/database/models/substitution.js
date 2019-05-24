const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubstitutionSchema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  }
});

module.exports = modelName => mongoose.model(modelName, SubstitutionSchema);
