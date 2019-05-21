const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventSchema = new Schema({
  //  id топика
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // название встречи ( ==  topic.title )
  eventTitle: { type: String, required: false },
  //  список участников и их статусов
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: false },
      status: { type: String, required: false, default: 'free' }
    }
  ],
  // место проведения ( == topic.location )
  place: { type: String, required: false },
  // дата проведения
  date: { type: Number, required: false }
});

module.exports = modelName => mongoose.model(modelName, EventSchema);
