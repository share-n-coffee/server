const TelegramBot = require('node-telegram-bot-api');
const { telegramBotToken } = require('../config/config');

const bot = new TelegramBot(telegramBotToken, { polling: true });

// Тексты сообщений из базы данных
const botConfig = {
  banMessage: 'Ты забанен',
  remindMessage: 'Напоминаем тебе про встречу:'
};

module.exports = {
  notify(notifyType, user, event) {
    const { firstName, telegramChatId, banned } = user;
    let message = `Привет, ${firstName}!${'\n'}`;
    switch (notifyType) {
      case 'ban':
        message += `${botConfig.banMessage}`;
        if (banned.expired != null) {
          message += ` до ${banned.expired}`;
        }
        break;
      case 'remind':
        message += `${botConfig.remindMessage}${'\n'}`;
        if (event) {
          message += `${event.title}`;
        }
        break;
      default:
        message += `${notifyType}`;
    }
    bot
      .sendMessage(telegramChatId, message)
      .catch(err => console.log(err.response.body));
  }
};
