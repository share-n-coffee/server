/* eslint-disable camelcase */
const TelegramBot = require('node-telegram-bot-api');
const { telegramBotToken } = require('../config/config');
const logger = require('../logger');

const bot = new TelegramBot(telegramBotToken, { polling: true });

// Тексты сообщений из базы данных
const botConfig = {
  banText: 'Ты забанен',
  unbanText: 'Время твоего бана истекло',
  unsubscribeText: 'Ты отписан от канала',
  inviteText: 'Поздравляем, ты отправляешься на встречу:',
  remindText: 'Напоминаем тебе про встречу:',
  acceptText: 'Я иду!',
  declineText: 'Не в этот раз :(',
  acceptReply: 'Очень круто, что ты подтвердил, не опаздывай!',
  declineReply: 'Очень жаль, что ты отклонил, увидимся в другой раз!'
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
    const { firstName, telegramChatId, banned } = user;
    let message = `Привет, ${firstName}!${'\n'}`;
    let replyObj;

    switch (notifyType) {
      case 'ban':
        message += `${botConfig.banText}`;
        if (banned.expired != null) {
          message += ` до ${banned.expired}`;
        }
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
                [{ text: botConfig.acceptText, callback_data: 'accept' }],
                [{ text: botConfig.declineText, callback_data: 'decline' }]
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
      .sendMessage(telegramChatId, message, replyObj)
      .catch(err => logger.error(err.response.body.description));
  },
  mailing() {
    // метод рассылки...
  }
};
