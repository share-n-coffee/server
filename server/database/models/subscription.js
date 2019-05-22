const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubscribtionSchema = new Schema({
  // топик, на который подписан пользователь
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  //  id подписанного пользователя
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Количество возможностей попасть в ивент по данном топику
  visitsRemained: { type: Number, required: true }
});

module.exports = modelName => mongoose.model(modelName, SubscribtionSchema);
