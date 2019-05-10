/* eslint-disable import/order */
const DBController = require('../database/dbController');
// eslint-disable-next-line import/order
// eslint-disable-next-line prefer-destructuring
const CronJob = require('cron').CronJob;
const pairsGenerator = require('./pairsGenerator');

const job = new CronJob('0 */10 * * * *', () => {
  Promise.all([
    DBController.getAllEvents(),
    DBController.getAllDepartments()
  ]).then(data => {
    pairsGenerator(data); // <===  Функция генерации пар//
  });
});

module.exports = job.start();
// Тестовая попытка запуска рандомайзера //
