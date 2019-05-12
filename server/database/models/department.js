const mongoose = require('mongoose');

const { Schema } = mongoose;

const DepartmentSchema = new Schema({
  //  Название отдела
  title: {
    type: String,
    required: true
  },
  //  Описание отдела
  description: {
    type: String,
    required: false
  },
  //  Дата создания
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('demo_Department', DepartmentSchema);
