/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
// eslint-disable-next-line prefer-destructuring
const CronJob = require('cron').CronJob;
const DBController = require('../database/dbController');
const checkData = require('./checkDataCorrectness');
const addNewPairs = require('./substitution');
const generateUpcomingDatesByTopic = require('./generateUpcomingDatesByTopic');
const checkLastEventsCreationDate = require('./checkLastEventsCreationDate');
const addParticipants = require('./addParticipants');
const restoreVisits = require('./restoreVisits');

const controller = new DBController();

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

    allTopics.forEach(topic => {
      if (topic.active === false) return;
      if (topic.cyclic === true) {
        restoreVisits(topic);
        if (!checkLastEventsCreationDate(topic.lastEventsCreationDate)) return;
        console.log('start cyclic event generating');
        const dates = generateUpcomingDatesByTopic(topic);
        dates.forEach(date => {
          controller.addEvent(topic.id, date);
        });
      } else {
        if (topic.lastEventsCreationDate) return;
        console.log('start simple event generating');
        controller.addEvent(topic.id, topic.singleDate);
      }
      const dateOfEventsСreation = +new Date();
      controller.updateLastEventsCreationDate(topic.id, dateOfEventsСreation);
    });

    console.log('all topics checked and possible events created');
  }

  static async randomizer() {
    const allEvents = await controller.getAllEvents();
    for (const event of allEvents) {
      await RandController.removePastEvents(event);
      await addParticipants(event);
    }
  }

  static async removePastEvents(event) {
    const currentDate = new Date();
    if (currentDate > event.date) {
      const users = await controller.getAllUsersByEvent(event.id);
      const eventUsers = users.participants;
      const eventParticipants = [].concat(eventUsers);

      for (const participant of eventParticipants) {
        await controller.removeUserEventByUserId(participant.userId, event.id);
      }

      await controller.removeEventByEventId(event.id);
    }
  }

  static async makeSubstitution(eventId) {
    await controller.createEvent(eventId);
  }
}

// RandController.makeSubstitution('5cd6f6c381371d297acb2fe0'); // метод для вызова ботом в случае отказа пользователя

module.exports = RandController;

const substitution = new CronJob('*/30 * * * * *', async () => {
  /* if (substitutionQueue.length !== 0) {
     addNewPairs(substitutionQueue.pop());
  } */
});

substitution.start();

const eventsGenerator = new CronJob('*/15 * * * * *', () => {
  RandController.generateEventsForTopics();
});

eventsGenerator.start();

const randomizer = new CronJob('*/10 * * * * *', () => {
  RandController.randomizer();
});

randomizer.start();
