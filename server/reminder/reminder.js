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
  controller.getAllEventsNotificationTimeExpired(n).then(events => {
    console.log(events);
    events.forEach(event => {
      event.participants.forEach(user => {
        if (user.status === 'notified') {
          console.log(user.userId);
          bot.mailing(event.id, 'remind'); // вызов c remind в качестве теста(должен быть другой тип)
          controller.setUserStatusByEventId(event.id, user.userId, 'expired');
        }
      });
    });
  });
}

task.start();
