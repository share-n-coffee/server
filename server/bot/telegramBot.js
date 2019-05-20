/* eslint-disable camelcase */
const TelegramBot = require('node-telegram-bot-api');
const { telegramBotToken } = require('../config/config');
const logger = require('../logger');
const DBController = require('../database/dbController');

const bot = new TelegramBot(telegramBotToken, { polling: true });
const controller = new DBController('randomizer', 'user');
const randomizerMethods = require('../database/factories/randomizerMethodsFactory');
const userMethods = require('../database/factories/userMethodsFactory')

// Тексты сообщений из базы данных
const botConfig = {
  accepetMeeting: 'Ваша пар подобрана! приятного кофепития'
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
  let { data } = callbackQuery;
  let updatedMessage = `${text}${'\n\n\n'}`;
  console.log('data', data);
  data = data.substring(6);
  const eventId = data.substring(0, data.indexOf('$') - 1);
  const pairId = data.substring(data.indexOf('$') +1)
  const userStatusUpdate = {};
  if (callbackQuery.data === `accept${data}`) {
    userMethods.setEventStatus([ userStatusUpdate[chat.id]={eventId:'accepted'}])
    controller
      .getEventPairsById(eventId)
      .then(eventPair => {
        eventPair.pairs.forEach(pair => {
          const { invitedUser1, invitedUser2, event } = pair;
          const pairId = pair.id
          let user1
          let user2
          controller
            .getUserByTelegramUserId(invitedUser1)
            .then(user =>  user1 =user.events.find( event => { return eventId=== event.eventId}))
            .catch(error => logger.error(error));
          controller
            .getUserByTelegramUserId(invitedUser2)
            .then(user => user2 = user.events.find( event => { return eventId=== event.eventId}))
            .catch(error => logger.error(error));
          if(user1.event.status==='accepted' && user1.event.status==='accepted'){
//отправляем сообщение о том, что пара подобрана
          }
        });

      })

      .catch(error => logger.error(error));

  }
  else {
    updatedMessage += `${botConfig.declineReply}`;
    userMethods.setEventStatus([ userStatusUpdate[chat.id]={eventId:'declined'}]);
    controller
      .getEventPairsById(eventId)
      .then(eventPair => {
        eventPair.pairs.forEach(pair => {
          const { invitedUser1, invitedUser2, event } = pair;
          const pairId = pair.id
          let user1
          let user2
          controller
            .getUserByTelegramUserId(invitedUser1)
            .then(user =>  user1 =user.events.find( event => { return eventId=== event.eventId}))
            .catch(error => logger.error(error));
          controller
            .getUserByTelegramUserId(invitedUser2)
            .then(user => user2 = user.events.find( event => { return eventId=== event.eventId}))
            .catch(error => logger.error(error));
          if (user1.event.status==='declined' ){
            userMethods.setEventStatus([ userStatusUpdate[invitedUser1]={eventId:'free'}]);
          }
          else if(user2.event.status==='declined' ){
            userMethods.setEventStatus([ userStatusUpdate[invitedUser2]={eventId:'free'}]);()

            randomizerMethods.removePair(eventId, pairId);
          }

          bot
            .editMessageText(updatedMessage, {
              chat_id: chat.id,
              message_id
            })
            .catch(err => logger.error(err.response.body.description));
        });

        module.exports = {
          notify(notifyType, user, event, eventId, pairId) {
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
              case 'accepted':
                message += `${botConfig.accepetMeeting}`;
                break;

              case 'invite':
                message += `${botConfig.inviteText}${'\n'}`;
                if (event) {
                  message += `${getEventDescription(event)}`;
                  replyObj = {
                    reply_markup: {
                      inline_keyboard: [
                        [
                          { text: botConfig.acceptText, callback_data: `accept${eventId}$${pairId}` },
                          { text: botConfig.declineText, callback_data: `decline${eventId}$${pairId} `}
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
                  const pairId = pair.id
                  controller
                    .getUserByTelegramUserId(invitedUser1)
                    .then(user => this.notify('invite', user, event, eventId, pairId))
                    .catch(error => logger.error(error));
                  controller
                    .getUserByTelegramUserId(invitedUser2)
                    .then(user => this.notify('invite', user, event, eventId, pairId))
                    .catch(error => logger.error(error));
                });
              })
              .catch(error => logger.error(error));
          },

          MailingForOnePair(){
            const { invitedUser1, invitedUser2, event, _id} = pair;
            controller
              .getUserByTelegramUserId(invitedUser1)
              .then(user => this.notify('invite', user, event, eventId,_id))
              .catch(error => logger.error(error));
            controller
              .getUserByTelegramUserId(invitedUser2)
              .then(user => this.notify('invite', user, event, _id))
              .catch(error => logger.error(error));


          }
        };
