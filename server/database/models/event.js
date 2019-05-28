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
      notifyDate: { type: String, required: false },
      _id: false
    }
  ],
  // дата проведения
  date: { type: Number, required: false },
  // статус уведомления у события
  isReminded: { type: Boolean, required: false, default: false }
});

module.exports = modelName => mongoose.model(modelName, EventSchema);
