const TelegramBot = require('node-telegram-bot-api');
const { telegramBotToken } = require('../config/config');

const bot = new TelegramBot(telegramBotToken, { polling: true });

// Тексты сообщений из базы данных
const botConfig = {
  banText: 'Ты забанен',
  unbanText: 'Время твоего бана истекло',
  unsubscribeText: 'Ты отписан от канала',
  inviteText: 'Поздравляем, ты отправляешься на встречу:',
  remindText: 'Напоминаем тебе про встречу:',
  acceptText: 'Я иду!',
  declineText: 'Не в этот раз :('
};

const getEventDescription = event => {
  return `${event.title}${'\n'}${event.description}`;
};

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
      .catch(err => console.log(err.response.body));
  },
  mailing() {
    // метод рассылки...
  }
};
