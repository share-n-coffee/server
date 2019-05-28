const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const LogSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: true
  },
  payload: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    default: Date.now()
  }
});

module.exports = modelName => model(modelName, LogSchema);
