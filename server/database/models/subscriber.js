const mongoose = require('mongoose');

const { Schema } = mongoose;

const subscriberSchema = new Schema({
  //  id пользователя
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // массив подписок пользователя
  topics: [
    {
      topicId: { type: mongoose.Schema.Types.ObjectId, required: true }
    }
  ]
});

module.exports = modelName => mongoose.model(modelName, subscriberSchema);
