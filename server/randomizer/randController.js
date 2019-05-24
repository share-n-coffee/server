/* eslint-disable import/order */
const DBController = require('../database/dbController');
// eslint-disable-next-line import/order
// eslint-disable-next-line prefer-destructuring
const CronJob = require('cron').CronJob;
const checkData = require('./checkDataCorrectness');
const addNewPairs = require('./substitution');
const generateUpcomingDatesByTopic = require('./generateUpcomingDatesByTopic');
const checkLastEventsCreationDate = require('./checkLastEventsCreationDate');

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
        if (!checkLastEventsCreationDate(topic.lastEventsCreationDate)) return;
        console.log('start cyclic event generating');
        const dates = generateUpcomingDatesByTopic(topic);
        dates.forEach(async date => {
          await controller.addEvent(topic.id, date);
        });
      } else {
        if (topic.lastEventsCreationDate) return;
        console.log('start simple event generating');
        await controller.addEvent(topic.id, topic.singleDate);
      }
      const dateOfEventsСreation = +new Date();
      await controller.updateLastEventsCreationDate(
        topic.id,
        dateOfEventsСreation
      );
    });

    console.log('all topics checked and possible events created');
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

const eventsGenerator = new CronJob('*/15 * * * * *', () => {
  RandController.generateEventsForTopics();
});

eventsGenerator.start();
