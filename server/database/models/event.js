const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventSchema = new Schema({
  //  Состояние события.
  //  Если админ скрыл событие или одиночное событие прошло, то переводим флаг в false
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  // Название события
  title: {
    type: String,
    required: true
  },
  //  Описание события
  description: {
    type: String,
    required: true
  },
  //  Координаты места проведения
  //  Формат: "7.1854773, 1.9979411"
  location: {
    type: Array,
    required: true
  },
  event: {
    // Является ли событие повторяющимся
    cyclic: {
      type: Boolean,
      required: true,
      default: false
    },
    //  День недели, начиная с воскресенья, в который проводится событие
    //  Для одиночного события – не имеет значения
    regularity: {
      type: Number,
      required: false
    },
    //  Даты следующих событий, пересчитывается отдельным скриптом перед работой рандомайзера
    //  Если создаётся одиночное событие, то этот параметр ему выставляется сразу, один элементом массива
    nextDates: [
      {
        type: Date,
        required: false
      }
    ]
  },
  //  Дата добавления события в БД
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = modelName => mongoose.model(modelName, EventSchema);
