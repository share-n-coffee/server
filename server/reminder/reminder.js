// здесь будет крутиться cron для рассылки уведолений
const cron = require('node-cron');
const bot = require('../bot/telegramBot');
const ClassDBController = require('../database/dbController');

const controller = new ClassDBController('event', 'topic', 'user');
console.log('test');
const task = cron.schedule('*/20 * * * * *', () => {
  const time = Date.now();
  console.log(time);
  notifyCaseAccepted();
  notifyCaseDeclined();
  checkExpiredUsers(10000000); // рандомное время  в течение которого ждем ответ от юзера
});

function notifyCaseAccepted() {
  // функция для  уведомления юзера за день до события
  controller
    .getUpcomingEventsBothAccepted()
    .then(events => {
      events.forEach(event => {
        console.log(event);
        if (event.isReminded === false) {
          controller.getUpdateEventStatus(event.id);
          bot.mailing(event.id, 'remind');
        }
      });
    })

    .catch(err => console.log(err));
}

function notifyCaseDeclined() {
  // функция уведомления юзера за n до события в случае, когда событие не состоится
  controller
    .getUpcomingEventsOneAccepted()
    .then(events => {
      events.forEach(event => {
        if (event.isReminded === false) {
          controller.getUpdateEventStatus(event.id);
          event.participants.forEach(user => {
            if (user.status === 'accepted') {
              bot.mailing(event.id, 'remind');
            }
          });
        }
      });
    })
    .catch(err => console.log(err));
}
function checkExpiredUsers(n) {
  // функция для определения периода с истекшим периодом ответа на  уведомление
  controller
    .getAllEventsNotificationTimeExpired(n)
    .then(events => {
      console.log(events);
      events.forEach(event => {
        event.participants.forEach(user => {
          const person = {
            firstName: null,
            telegramID: null,
            description: null,
            title: null
          };
          if (user.status === 'notified') {
          controller.getUserByUserId(user.userId).then(userData => {
              person.firstName = userData.firstName;
              person.telegramID = userData.telegramId;
            });
            controller
              .setUserStatusByEventId(event.id, user.userId, 'expired')
              .addEventForSubstitution(event.id)
              .getTopicById(event.topicId).then(topicData => {
              person.description = topicData.description;
                person.title = topicData.title;
            bot.notify(
              'meetingFail',
              { firstName: person.firstName, telegramUserId: person.telegramID },
              {
                  title: person.title,
                  description: person.description
                  }
                );
              });
          }
        });
      });
    })

    .catch(err => console.log(err));
}

task.start();
