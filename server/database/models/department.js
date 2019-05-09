const mongoose = require('mongoose');

const { Schema } = mongoose;

const DepartmentSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('demo_Department', DepartmentSchema);
