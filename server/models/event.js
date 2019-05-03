const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  regularity: {
    type: Date,
    required: true
  }
});

module.exports = Event = mongoose.model('Event', EventSchema);
