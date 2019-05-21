const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const LogSchema = new Schema({
  userId: {
    type: Number,
    required: true
  },
  actionType: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    default: Date.now()
  }
});

module.exports = modelName => model(modelName, LogSchema);
