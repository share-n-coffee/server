/* eslint-disable camelcase */
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const { telegramBotToken } = require('../config/config');
const logger = require('../logger');
const DBController = require('../database/dbController');
const RandController = require('../randomizer/randController');

const bot = new TelegramBot(telegramBotToken, { polling: true });
const controller = new DBController('user', 'event', 'topic');

// Тексты сообщений из базы данных
const botConfig = {
  textLocation: 'посмотреть место на карте',
  map: 'Нажми, на карту, чтобы увеличить',
  banText: 'Ты забанен',
  unbanText: 'Время твоего бана истекло',
  unsubscribeText: 'Ты отписан от канала',
  inviteText: 'Поздравляем, ты отправляешься на встречу☕:',
  remindText: 'Напоминаем тебе про встречу:',
  acceptText: 'Я иду!😋',
  declineText: 'Не в этот раз 😞',
  acceptReply: 'Очень круто 😉 , что ты подтвердил, не опаздывай!',
  declineReply: 'Очень жаль, что ты отклонил☹, увидимся в другой раз!',
  notificationLogText: 'Пользователь успешно оповещён о событии',
  notificationErrorLogText: 'Пользователь не получил оповещение',
  userAcceptLogText: 'Пользователь принял приглашение на событие',
  userDeclineLogText: 'Пользователь отклонил приглашение на событие'
};

const getEventDescription = event => {
  const eventDate = new Date(event.date);

  return `${event.title}
  ${'\n'}${event.description}${'\n'}${eventDate.toLocaleString('ru-RU')}`;
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
    updatedMessage += `${botConfig.acceptReply}`;
    replyText = botConfig.userAcceptLogText;
    status = 'accepted';
  } else {
    updatedMessage += `${botConfig.declineReply}`;
    replyText = botConfig.userDeclineLogText;
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
      controller.setUserStatusByEvent(eventId, userData.id, status)
    )
    .then(() => {
      if (status === 'declined') {
        RandController.makeSubstitution(eventId);
      }
    })
    .catch(err => logger.error(err.message));
});

module.exports = {
  notify(notifyType, user, event) {
    const { firstName, telegramId } = user;
    let message = `Привет, ${firstName}😉!${'\n'}`;
    let replyObj;
    switch (notifyType) {
      case 'ban':
        message += `${botConfig.banText}`;
        break;

      case 'unban':
        message += `${botConfig.unbanText}`;
        break;

      case 'unsubscribe':
        message += `${botConfig.unsubscribeText}`;
        break;

      case 'invite':
        message += `${botConfig.inviteText}${'\n'}`;
        if (event) {
          message += `${getEventDescription(event)}`;
          replyObj = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: botConfig.acceptText,
                    callback_data: `acpt${event.id}` // передаем статус ответа вместе с eventId в строке
                  },
                  {
                    text: botConfig.declineText,
                    callback_data: `dcln${event.id}`
                  }
                ]
              ]
            }
          };
        }
        break;

      case 'remind':
        message += `${botConfig.remindText}${'\n'}`;
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

          logger.info(
            telegramId,
            'Notification',
            `${botConfig.notificationLogText} ${event.id}`
          );
        })
        .catch(err => {
          reject(err);

          logger.info(
            telegramId,
            'Notification',
            `${botConfig.notificationErrorLogText}.
            ${err.response.body.description}`
          );
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
                controller.setUserStatusByEvent(
                  eventId,
                  user.userId,
                  newStatus
                );
              })
              .catch(err => logger.error(err.message));
          }
        });
      })
      .catch(err => logger.error(err.message));
  }
};
