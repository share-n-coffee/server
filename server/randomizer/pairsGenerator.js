/* eslint-disable no-param-reassign */
const DBController = require('../database/dbController');
const generateSingleEventPairs = require('./generateSingleEventPairs');

const controller = new DBController();

function pairsGenerator(event, allUsers) {
  function generateCyclicEventPairs() {}

  function checkTypeOfEvent() {
    if (event.options.cyclic === false) {
      // в новой схеме обращаться через options
      generateSingleEventPairs(event, allUsers);
    } else {
      generateCyclicEventPairs();
    }
  }

  checkTypeOfEvent(event); // проверяем вид события
}

module.exports = pairsGenerator;
