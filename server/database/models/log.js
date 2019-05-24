const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const LogSchema = new Schema({
  userId: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    default: Date.now()
  }
});

module.exports = modelName => model(modelName, LogSchema);
