/* eslint-disable camelcase */
const TelegramBot = require('node-telegram-bot-api');
const { telegramBotToken } = require('../config/config');
const logger = require('../logger');
const DBController = require('../database/dbController');

const bot = new TelegramBot(telegramBotToken, { polling: true });
const controller = new DBController('randomizer', 'user');

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
  declineReply: 'Очень жаль, что ты отклонил☹, увидимся в другой раз!'
};

const getEventDescription = event => {
  return `${event.title}${'\n'}${event.description}`;
};

// Реагируем на ответы пользователя
bot.on('callback_query', callbackQuery => {
  const { text, chat, message_id } = callbackQuery.message;
  let updatedMessage = `${text}${'\n\n\n'}`;

  if (callbackQuery.data === 'accept') {
    updatedMessage += `${botConfig.acceptReply}`;
  } else {
    updatedMessage += `${botConfig.declineReply}`;
  }

  bot
    .editMessageText(updatedMessage, {
      chat_id: chat.id,
      message_id
    })
    .catch(err => logger.error(err.response.body.description));
});

module.exports = {
  notify(notifyType, user, event) {
    const { firstName, telegramUserId } = user;
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
                  { text: botConfig.acceptText, callback_data: 'accept' },
                  { text: botConfig.declineText, callback_data: 'decline' }
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

    bot
      .sendMessage(telegramUserId, message, replyObj)
      .then(data => {
        console.log(
          `Пользователь ${data.chat.first_name} ${data.chat.last_name} c id 
          ${data.chat.id} оповещен в Telegram ${data.date.toString()}`
        );
      })
      .catch(err => logger.error(err.response.body.description));
  },
  mailing(eventId) {
    controller
      .getEventPairsById(eventId)
      .then(eventPair => {
        eventPair.pairs.forEach(pair => {
          const { invitedUser1, invitedUser2, event } = pair;

          controller
            .getUserByTelegramUserId(invitedUser1)
            .then(user => this.notify('invite', user, event))
            .catch(error => logger.error(error));
          controller
            .getUserByTelegramUserId(invitedUser2)
            .then(user => this.notify('invite', user, event))
            .catch(error => logger.error(error));
        });
      })
      .catch(error => logger.error(error));
  }
};
