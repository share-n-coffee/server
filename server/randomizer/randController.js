/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
// eslint-disable-next-line prefer-destructuring
const CronJob = require('cron').CronJob;
const DBController = require('../database/dbController');
const tryToSubsitute = require('./substitution');
const generateUpcomingDatesByTopic = require('./generateUpcomingDatesByTopic');
const checkLastEventsCreationDate = require('./checkLastEventsCreationDate');
const addParticipants = require('./addParticipants');
const restoreVisits = require('./restoreVisits');

const controller = new DBController();

class RandController {
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
        const year = new Date(topic.singleDate).getFullYear();
        const month = new Date(topic.singleDate).getMonth();
        const day = new Date(topic.singleDate).getDate();
        const hour = topic.time.slice(0, topic.time.indexOf(':'));
        const minutes = topic.time.slice(topic.time.indexOf(':') + 1);
        const date = new Date(year, month, day, hour, minutes);
        controller.addEvent(topic.id, date);
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

    const requiredSubstitutions = await controller.getAllEventsForSubstitution();
    for (const eventForSubstitution of requiredSubstitutions) {
      const substitutionSuccessfull = await tryToSubsitute(
        eventForSubstitution.eventId
      );
      if (substitutionSuccessfull) {
        console.log(
          `Substitution for event ${
            eventForSubstitution.eventId
          } has been completed`
        );
        await controller.removeSubstitutedEvent(eventForSubstitution.eventId);
      }
    }
  }

  static async removePastEvents(event) {
    const currentDate = new Date();
    if (currentDate > event.date) {
      const eventParticipants = [].concat(event.participants);
      for (const participant of eventParticipants) {
        await controller.removeUserEventByUserId(participant.userId, event.id);
        const topicOfEvent = await controller.getTopicById(event.topicId);
        if (topicOfEvent.cyclic === false) {
          await controller.removeSubscription(
            event.topicId,
            participant.userId
          );
        }
      }

      controller.addEventToArchive(event);
      await controller.removeEventByEventId(event.id);
    }
  }
}

module.exports = RandController;

const eventsGenerator = new CronJob('*/15 * * * * *', () => {
  RandController.generateEventsForTopics();
});

eventsGenerator.start();

const randomizer = new CronJob('*/10 * * * * *', () => {
  RandController.randomizer();
});

randomizer.start();
