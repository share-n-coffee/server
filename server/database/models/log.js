const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const LogSchema = new Schema({
  userId: {
    type: Number,
    required: true
  },
  logType: {
    type: String,
    required: true
  },
  logMessage: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    default: Date.now()
  }
});

module.exports = modelName => model(modelName, LogSchema);
