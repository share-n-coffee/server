/* eslint-disable import/order */
const DBController = require('../database/dbController');
// eslint-disable-next-line import/order
// eslint-disable-next-line prefer-destructuring
const CronJob = require('cron').CronJob;
const randomizer = require('./pairsGenerator');
const checkData = require('./checkDataCorrectness');

const controller = new DBController();

const job = new CronJob('*/5 * * * * *', () => {
  Promise.all([
    controller.getAllEvents(),
    controller.getAllDepartments(),
    controller.getAllUsers()
  ]).then(allData => {
    checkData(allData);
    /* controller.removeEventPairs().then(() => {
      pairsGenerator(data); // <===  Функция генерации пар//
    }); */
  });
});

module.exports = job.start();
// Тестовая попытка запуска рандомайзера //
