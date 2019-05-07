const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desciption: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = Department = mongoose.model('Department', DepartmentSchema);
