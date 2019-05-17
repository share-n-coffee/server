/* eslint-disable import/order */
const DBController = require('../database/dbController');
// eslint-disable-next-line import/order
// eslint-disable-next-line prefer-destructuring
const CronJob = require('cron').CronJob;
const pairsGenerator = require('./pairsGenerator');
const checkData = require('./checkDataCorrectness');

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

  static async selectEventForPairGenerating(eventId) {
    const eventToBalance = await controller.getEventById(eventId);
    const allUsers = await controller.getAllUsers();

    if (eventToBalance.active) {
      pairsGenerator(eventToBalance, allUsers);
    } else {
      throw Error('Event has been disabled');
    }
  }
}

/* const job = new CronJob('* * * * * *', () => {
   controller.removeEventPairs().then(() => {
      pairsGenerator(data); // <===  Функция генерации пар//
    }); 
});
job.start();
*/

module.exports = RandController;
// Тестовая попытка запуска рандомайзера //
