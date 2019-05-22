/* eslint-disable import/order */
const DBController = require('../database/dbController');
// eslint-disable-next-line import/order
// eslint-disable-next-line prefer-destructuring
const CronJob = require('cron').CronJob;
const checkData = require('./checkDataCorrectness');
const addNewPairs = require('./substitution');
const generateUpcomingDatesByTopic = require('./generateUpcomingDatesByTopic');

const controller = new DBController();
const substitutionQueue = [];

class RandController {
  static checkAllData() {
    Promise.all([
      controller.getAllEvents(),
      controller.getAllDepartments(),
      controller.getAllUsers()
    ])
      .then(allData => {
        checkData(allData);
      })
      .catch(error => {
        throw Error(error);
      });
  }

  static async generateEventsForTopics() {
    const allTopics = await controller.getAllTopics();
    allTopics.forEach(async topic => {
      if (topic.active === false) return;

      if (topic.cyclic === true) {
        const dates = generateUpcomingDatesByTopic(topic);
        dates.forEach(date => {
          RandController.createEvent(topic.id, date);
        });
        const dateOfEventsСreation = new Date();
        await controller.updateLastEventsCreatingDate(); // сделать метод, если нет еще
      } else {
        RandController.createEvent(topic.id, topic.date);
      }
    });
  }

  static async createEvent(topicId, date) {
    // создает событие как объект новой коллекции и добавляет в базу
  }

  static makeSubstitution(eventId) {
    substitutionQueue.unshift(eventId);
  }
}

// RandController.makeSubstitution('5cd6f6c381371d297acb2fe0'); // метод для вызова ботом в случае отказа пользователя

module.exports = RandController;

const substitution = new CronJob('*/30 * * * * *', () => {
  if (substitutionQueue.length !== 0) {
    addNewPairs(substitutionQueue.pop());
  }
});

substitution.start();

const eventsGenerator = new CronJob('*/30 * * * * *', () => {
  RandController.generateEventsForTopics();
});

eventsGenerator.start();

// тестируем работу генерации дат
/*
const dates = generateUpcomingDatesByTopic({
  _id: '5cd6f6c381371d297acb2fe0',
  active: true,
  title: 'Furnitech',
  description:
    'Irure tempor qui tempor id mollit aliquip pariatur est nisi. Exercitation consequat eiusmod non Lorem nisi. Pariatur aute excepteur laborum cupidatat sint fugiat. Reprehenderit do laborum Lorem tempor dolore. Dolore eiusmod qui duis enim ut ex.',
  location: ['53.886666', '27.53039'],
  address: '594 Neptune Court, Rehrersburg, Tennessee',
  cyclic: true,
  weekDay: 3,
  time: '11:45',
  created: 1558161349720,
  lastEventsCreationDate: 1560624944000
});

console.log(dates);
*/
