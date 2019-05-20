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
    type: Number,
    default: new Date().getTime(),
    required: false
  }
});

module.exports = modelName => mongoose.model(modelName, DepartmentSchema);
