/* eslint-disable camelcase */
/* eslint-disable dot-notation */
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const { telegramBotToken } = require('../config/config');
const DBController = require('../database/dbController');
const logger = require('../logger');

const { logTypes } = logger;
const bot = new TelegramBot(telegramBotToken, { polling: true });
const controller = new DBController('user', 'event', 'topic', 'substitution');

// Тексты сообщений
const {
  textLocation,
  mapText,
  banText,
  unbanText,
  unsubscribeText,
  inviteText,
  remindText,
  apologyText,
  acceptText,
  declineText,
  acceptReply,
  declineReply,
  notificationLogText,
  notificationErrorLogText,
  userAcceptLogText,
  userDeclineLogText
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
  return `\n${event.title}\n${event.description}\n${eventDate}`;
};

// Реагируем на ответы пользователя
bot.on('callback_query', callbackQuery => {
  const { text, chat, message_id } = callbackQuery.message;
  // парсим строку с ответом от пользователя
  const reply = callbackQuery.data.slice(0, 4);
  const eventId = callbackQuery.data.slice(4);
  let updatedMessage = `${text}${'\n\n\n'}`;
  let replyText;
  let status;

  if (reply === 'acpt') {
    updatedMessage += `${acceptReply}`;
    replyText = userAcceptLogText;
    status = 'accepted';
  } else {
    updatedMessage += `${declineReply}`;
    replyText = userDeclineLogText;
    status = 'declined';
  }

  bot
    .editMessageText(updatedMessage, {
      chat_id: chat.id,
      message_id
    })
    .then(() => {
      logger.info(chat.id, 'Notification', `${replyText} ${eventId}`);
      return controller.getUserByTelegramId(chat.id);
    })
    .then(userData =>
      controller.setUserStatusByEventId(eventId, userData.id, status)
    )
    .then(() => {
      if (status === 'declined') {
        controller.addEventForSubstitution(eventId);
      }
    })
    .catch(err => logger.error(err.message));
});

/*

const editMessage = status => {
  if (status !== 'notified') {
    updatedMessage = 'Что-то пошло не так...'
    Bot.editMessageText(updatedMessage, {
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

  return Bot.editMessageText(updatedMessage, {
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
  .then(status => editMessage(status)) // проверяем статус и редактируем сообщение
  .then(() => controller.setUserStatusByEventId(eventId, id, newStatus)) // обновляем статус
  .then(() => {
    logger.info(chat.id, 'Notification', `${replyText} ${eventId}`);

    if (newStatus === 'declined') {
      return controller.addEventForSubstitution(eventId); // вызываем замену
    }
  })
  .catch(err => logger.err(err));

*/

module.exports = {
  notify(notifyType, user, event) {
    const { id, firstName, telegramId } = user;
    const eventId = event.id;
    let message = `Привет, ${firstName}😉!${'\n'}`;
    let replyObj;
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
          replyObj = {
            reply_markup: {
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
            }
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
    const event = {
      id: eventId
    };

    controller
      .getEventById(eventId)
      .then(eventData => {
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
                if (notifyType === 'invite') {
                  newStatus = 'notified';
                }
                if (notifyType === 'remind' || notifyType === 'apology') {
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
