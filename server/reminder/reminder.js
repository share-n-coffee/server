// здесь будет крутиться cron для рассылки уведолений
const cron = require('node-cron');
const bot = require('../bot/telegramBot');
const ClassDBController = require('../database/dbController');

const controller = new ClassDBController('event', 'topic', 'user');
console.log('test');
const task = cron.schedule('*/20 * * * * *', () => {
  const time = Date.now();
  const currentTime = new Date().getTime();
  notifyCaseAccepted();
  notifyCaseDeclined();
});

function notifyCaseAccepted() {
  controller
    .getUpcomingEventsBothAccepted()
    .then(events => {
      events.forEach(event => {
        if (event.isNotifited === false) {
          controller.getUpdateEventStatus(event.id);
          event.participants.forEach(user => {
            const me = {
              firstName: null,
              telegramID: null,
              description: null,
              title: null
            };
            controller.getUserByUserId(user.userId).then(userData => {
              me.firstName = userData.firstName;
              me.telegramID = userData.telegramId;
            });
            controller.getTopicById(event.topicId).then(topicData => {
              me.description = topicData.description;
              me.title = topicData.title;
              bot.mailing(event.id, 'remind');
            });
          });
        }
      });
    })

    .catch(err => console.log(err));
}

function notifyCaseDeclined() {
  controller
    .getUpcomingEventsOneAccepted()
    .then(events => {
      events.forEach(event => {
        if (event.isNotifited === false) {
          controller.getUpdateEventStatus(event.id);
          event.participants.forEach(user => {
            const me = {
              firstName: null,
              telegramID: null,
              description: null,
              title: null
            };
            if (user.status === 'accepted') {
              controller.getUserByUserId(user.userId).then(userData => {
                me.firstName = userData.firstName;
                me.telegramID = userData.telegramId;
              });
              controller.getTopicById(event.topicId).then(topicData => {
                me.description = topicData.description;
                me.title = topicData.title;
                bot.mailing(event.id, 'remind');
              });
            }
          });
        }
      });
    })

    .catch(err => console.log(err));

  function checkExpiredUsers() {
    // функция для определения периода со времени первого оповещения юзера
  }
}

task.start();
