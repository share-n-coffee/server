const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  //  Телеграмовский идентификатор пользователя
  telegramId: {
    type: Number,
    required: false
  },
  //  Ссылка на аватар пользователя
  avatar: {
    type: String,
    required: false
  },
  //  Имя
  firstName: {
    type: String,
    required: false
  },
  //  Фамилия
  lastName: {
    type: String,
    required: false
  },
  //  Логин из телеграмма, либо для админа установленный вручную
  username: {
    type: String,
    required: true
  },
  banned: {
    //  Забанен ли пользователь
    status: {
      type: Boolean,
      required: false,
      default: false
    },
    //  Если забанен, когда истекает срок бана
    expired: {
      type: Number,
      default: 0,
      required: false
    }
  },
  //  Массив с событиями, в которых участвует пользователь
  events: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: false
      }
    }
  ],
  //  Отдел, в котором работает пользователь
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: false
  },
  //  Дата создания аккаунта (дата первой авторизации через телегу)
  created: {
    type: Number,
    default: new Date().getTime(),
    required: false
  },
  //  Если пользователь админ
  admin: {
    //  Админский флаг: 0 - просто юзер, 1 - админ, 2 - супер админ
    permission: {
      type: Number,
      required: true,
      default: 0
    },
    //  Админский пароль для входа в систему, если к админу не привязан телеграм
    password: {
      type: String,
      required: false,
      default: null
    }
  }
});

module.exports = modelName => mongoose.model(modelName, UserSchema);
