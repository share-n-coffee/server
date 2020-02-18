/* eslint-disable camelcase */
const TelegramBot = require('node-telegram-bot-api');
const logger = require('../logger');
const DBController = require('../database/dbController');
const {
  TELEGRAM_BOT_ENABLED,
  TELEGRAM_BOT_TOKEN
} = require('../config/config');
const BOT_CONFIG = require('./config');

let botApi;

if (TELEGRAM_BOT_ENABLED) {
  const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
  const controller = new DBController('randomizer', 'user');

  const getEventDescription = event => {
    return `${event.title}${'\n'}${event.description}`;
  };

  // Реагируем на ответы пользователя
  bot.on('callback_query', callbackQuery => {
    const { text, chat, message_id } = callbackQuery.message;
    let updatedMessage = `${text}${'\n\n\n'}`;

    if (callbackQuery.data === 'accept') {
      updatedMessage += `${BOT_CONFIG.texts.acceptReply}`;
    } else {
      updatedMessage += `${BOT_CONFIG.texts.declineReply}`;
    }

    bot
      .editMessageText(updatedMessage, {
        chat_id: chat.id,
        message_id
      })
      .catch(err => logger.error(err.response.body.description));
  });

  botApi = {
    notify(notifyType, user, event) {
      const { firstName, telegramUserId } = user;
      let message = `Привет, ${firstName}😉!${'\n'}`;
      let replyObj;
      switch (notifyType) {
        case 'ban':
          message += `${BOT_CONFIG.texts.banText}`;
          break;

        case 'unban':
          message += `${BOT_CONFIG.texts.unbanText}`;
          break;

        case 'unsubscribe':
          message += `${BOT_CONFIG.texts.unsubscribeText}`;
          break;

        case 'invite':
          message += `${BOT_CONFIG.texts.inviteText}${'\n'}`;
          if (event) {
            message += `${getEventDescription(event)}`;
            replyObj = {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: BOT_CONFIG.texts.acceptText,
                      callback_data: 'accept'
                    },
                    {
                      text: BOT_CONFIG.texts.declineText,
                      callback_data: 'decline'
                    }
                  ]
                ]
              }
            };
          }
          break;

        case 'remind':
          message += `${BOT_CONFIG.texts.remindText}${'\n'}`;
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
} else {
  botApi = {
    notify: () => {},
    mailing: () => {}
  };
}

module.exports = botApi;
