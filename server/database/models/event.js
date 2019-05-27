const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventSchema = new Schema({
  //  id топика
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  //  список участников и их статусов
  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
      },
      // status: pending, notified, accepted, declined
      status: { type: String, required: false, default: 'free' },
      _id: false,
      notificationDate: {
        type: Number,
        required: false
      }
    }
  ],
  // дата проведения
  date: { type: Number, required: false }
});

module.exports = modelName => mongoose.model(modelName, EventSchema);
