/* eslint-disable import/order */
const DBController = require('../database/dbController');
// eslint-disable-next-line import/order
// eslint-disable-next-line prefer-destructuring
const CronJob = require('cron').CronJob;
const pairsGenerator = require('./pairsGenerator');
const checkData = require('./checkDataCorrectness');
const addNewPairs = require('./substitution');

const controller = new DBController();
const substitutionQueue = ['5cd6f6c381371d297acb2fe0'];
const incommingCyclicEventsStorage = [];

const substitution = new CronJob('*/30 * * * * *', () => {
  if (substitutionQueue.length !== 0) {
    addNewPairs(substitutionQueue.pop());
  }
});

substitution.start();

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

  static async selectEventForPairGenerating(eventId) {
    const eventToBalance = await controller
      .getEventById(eventId)
      .catch(error => {
        console.log(error);
      });

    if (eventToBalance.active) {
      await controller.removeEventPairByEventId(eventId);
      pairsGenerator(eventToBalance); // <===  Функция генерации пар//
    } else {
      throw Error('Event has been disabled');
    }
  }

  static makeSubstitution(eventId) {
    substitutionQueue.unshift(eventId);
  }
}

// RandController.makeSubstitution('5cd6f6c381371d297acb2fe0'); // метод для вызова ботом в случае отказа пользователя

module.exports = RandController;
