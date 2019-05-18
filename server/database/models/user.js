const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  //  Телеграмовский идентификатор пользователя
  telegramUserId: {
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
  //  Массив с событиями, на которые подписан пользователь
  events: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
      },
      status: {
        type: String,
        required: false,
        default: 'free'
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
  //  Здесь хранятся все действия пользователя
  logs: {
    //  Всё подписки/отписки пользователя
    //  Массив объектов
    subscribedEvents: [
      {
        //  Идентификатор события
        event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Event',
          required: false
        },
        //  Действие пользователя ("subscribe"/"unsubscribe") (подписка/отписка)
        action: {
          type: String,
          required: false
        }
      }
    ],
    //  Всё приглашения на события, которые отправляются пользователю
    //  Массив объектов
    invitedEvents: [
      {
        //  Идентификатор события
        event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Event',
          required: false
        },
        //  Действие пользователя ("accept"/"decline") (подтвердил/отклонил)
        action: {
          type: String,
          required: false
        }
      }
    ],
    //  массив посещенных пользователем событий
    visitedEvents: [
      {
        //  Идентификатор события
        event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Event',
          required: false
        },
        //  Дата посещения
        date: {
          type: Number,
          required: false
        }
      }
    ],
    //  Все полученные пользователем баны
    bans: [
      {
        //  Дата бана
        startDate: {
          type: Number,
          required: false
        },
        //  Дата окончания бана
        endDate: {
          type: Number,
          required: false
        }
      }
    ]
  },
  //  Если пользователь админ
  admin: {
    //  Админский флаг
    isAdmin: {
      type: Boolean,
      required: false,
      default: false
    },
    //  Админский пароль для входа в систему, если к админу не привязан телеграм
    password: {
      type: String,
      required: false,
      default: null
    }
  },
  tokens: {
    origin: {
      type: String,
      required: false
    },
    expiredAt: {
      type: Number,
      required: false
    },
    refresh: {
      type: String,
      required: false
    }
  }
});

module.exports = modelName => mongoose.model(modelName, UserSchema);
