const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desciption: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  regularity: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('demo_Event', EventSchema);
