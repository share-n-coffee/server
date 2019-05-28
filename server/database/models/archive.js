const mongoose = require('mongoose');

const { Schema } = mongoose;

const ArchiveSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
      },
      // status: pending, notified, accepted, declined, reminded
      status: { type: String, required: false },
      _id: false,
      notificationDate: {
        type: Number,
        required: false
      }
    }
  ],
  date: {
    type: Number,
    required: true
  }
});

module.exports = modelName => mongoose.model(modelName, ArchiveSchema);
