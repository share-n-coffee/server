/* eslint-disable import/order */
const DBController = require('../database/dbController');
// eslint-disable-next-line import/order
// eslint-disable-next-line prefer-destructuring
const CronJob = require('cron').CronJob;
const pairsGenerator = require('./pairsGenerator');

const controller = new DBController();

const job = new CronJob('*/10 * * * * *', () => {
  Promise.all([
    controller.getAllEvents(),
    controller.getAllDepartments(),
    controller.getAllUsers()
  ]).then(data => {
    controller.removeEventPairs().then(() => {
      pairsGenerator(data); // <===  Функция генерации пар//
    });
  });
});

module.exports = job.start();
// Тестовая попытка запуска рандомайзера //
