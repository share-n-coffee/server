/* eslint-disable camelcase */

process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const { telegramBotToken } = require('../config/config');
const DBController = require('../database/dbController');
const logger = require('../logger');

let telegramBotPolling = false;
if (process.env.NODE_ENV === 'production') {
  telegramBotPolling = true;
}

const { logTypes } = logger;
const bot = new TelegramBot(telegramBotToken, { polling: telegramBotPolling });
const controller = new DBController('user', 'event', 'topic', 'substitution');

// Тексты сообщений
const {
  greeting,
  banText,
  unbanText,
  unsubscribeText,
  inviteText,
  remindText,
  apologyText,
  expiredText,
  acceptText,
  declineText,
  acceptReply,
  declineReply,
  notificationLogText,
  notificationErrorLogText,
  userAcceptLogText,
  userDeclineLogText,
  errorMessage
} = require('./botMessages');

const prettifyDate = timestamp => {
  const addZero = mark => `0${mark}`.slice(-2);
  const d = new Date(timestamp);
  const date = addZero(d.getDate());
  const month = addZero(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = addZero(d.getHours());
  const minutes = addZero(d.getMinutes());

  return `${date}.${month}.${year} ${hours}:${minutes}`;
};

const getEventDescription = event => {
  const eventDate = prettifyDate(event.date);
  return `\n<b>${event.title}</b>\n${event.description}\n${eventDate}`;
};

// Реагируем на ответы пользователя
bot.on('callback_query', callbackQuery => {
  const { text, chat, message_id } = callbackQuery.message;
  // парсим строку с ответом от пользователя
  const reply = callbackQuery.data.slice(0, 4);
  const eventId = callbackQuery.data.slice(4);
  let userId;
  let updatedMessage = `${text}${'\n\n\n'}`;
  let replyText;
  let newStatus;

  const editMessage = status => {
    if (status !== 'notified') {
      if (status === 'expired') {
        updatedMessage += expiredText;
      } else {
        updatedMessage = errorMessage;
      }
      bot.editMessageText(updatedMessage, {
        chat_id: chat.id,
        message_id
      });
      throw new Error(updatedMessage);
    }

    if (reply === 'acpt') {
      updatedMessage += `${acceptReply}`;
      replyText = userAcceptLogText;
      newStatus = 'accepted';
    } else {
      updatedMessage += `${declineReply}`;
      replyText = userDeclineLogText;
      newStatus = 'declined';
    }

    return bot.editMessageText(updatedMessage, {
      chat_id: chat.id,
      message_id
    });
  };

  controller
    .getUserByTelegramId(chat.id, { id: 1 }) // получаем id пользователя
    .then(id => {
      userId = id;
      return controller.getUserStatusByEventId(eventId, id); // получаем статус пользователя
    })
    .then(data => editMessage(data.participants[0].status)) // проверяем статус и редактируем сообщение
    .then(() => controller.setUserStatusByEventId(eventId, userId, newStatus)) // обновляем статус
    // eslint-disable-next-line consistent-return
    .then(() => {
      logger.info(userId, logTypes.userReply, { replyText, eventId });
      if (newStatus === 'declined') {
        return controller.addEventForSubstitution(eventId); // вызываем замену
      }
    })
    .catch(() => logger.info(userId, logTypes.userReply, { updatedMessage }));
});

module.exports = {
  notify(notifyType, user, event) {
    const { id, firstName, telegramId } = user;
    const eventId = event.id;
    const replyObj = {
      parse_mode: 'HTML'
    };
    let message = `${greeting}, ${firstName}😉!${'\n'}`;
    switch (notifyType) {
      case 'ban':
        message += `${banText}`;
        break;

      case 'unban':
        message += `${unbanText}`;
        break;

      case 'unsubscribe':
        message += `${unsubscribeText}`;
        break;

      case 'invite':
        message += `${inviteText}${'\n'}`;
        if (event) {
          message += `${getEventDescription(event)}`;
          replyObj.reply_markup = {
            inline_keyboard: [
              [
                {
                  text: acceptText,
                  callback_data: `acpt${eventId}` // передаем статус ответа вместе с eventId в строке
                },
                {
                  text: declineText,
                  callback_data: `dcln${eventId}`
                }
              ]
            ]
          };
        }
        break;

      case 'remind':
        message += `${remindText}${'\n'}`;
        if (event) {
          message += `${getEventDescription(event)}`;
        }
        break;

      case 'apology':
        message += `${apologyText}${'\n'}`;
        if (event) {
          message += `${getEventDescription(event)}`;
        }
        break;

      default:
        message += `${notifyType}`;
    }

    return new Promise((resolve, reject) => {
      bot
        .sendMessage(telegramId, message, replyObj)
        .then(data => {
          resolve(data);
          logger.info(id, logTypes.userNotification, { eventId, message });
        })
        .catch(err => {
          reject(err);

          logger.info(id, logTypes.userNotification, { eventId, message, err });
        });
    });
  },
  // метод рассылки
  mailing(eventId, notifyType = 'invite') {
    const event = {}; // объект для передачи в notify

    controller
      .getEventById(eventId)
      .then(eventData => {
        event.id = eventId;
        event.date = eventData.date;
        event.users = eventData.participants;

        return controller.getTopicById(eventData.topicId);
      })
      .then(topicData => {
        event.title = topicData.title;
        event.description = topicData.description;

        event.users.forEach(user => {
          if (
            (user.status === 'pending' && notifyType === 'invite') ||
            (user.status === 'accepted' &&
              (notifyType === 'remind' || notifyType === 'apology'))
          ) {
            controller
              .getUserByUserId(user.userId)
              .then(userData => this.notify(notifyType, userData, event))
              .then(() => {
                let newStatus;
                if (user.status === 'pending') {
                  newStatus = 'notified';
                }
                if (user.status === 'accepted') {
                  newStatus = 'reminded';
                }
                return controller.setUserStatusByEventId(
                  eventId,
                  user.userId,
                  newStatus
                );
              })
              .then(() => {
                if (!user.notificationDate) {
                  controller.setNotificationDateByEventId(
                    eventId,
                    user.userId,
                    Date.now()
                  );
                }
              })
              .catch(err => logger.error(err.message));
          }
        });
      })
      .catch(err => logger.error(err.message));
  }
};
