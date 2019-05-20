/* eslint-disable no-param-reassign */
const DBController = require('../database/dbController');
const generateSingleEventPairs = require('./generateSingleEventPairs');
const generateCyclicEventPairs = require('./generateCyclicEventPairs');

const controller = new DBController();

function pairsGenerator(event) {
  function checkTypeOfEvent() {
    if (event.options.cyclic === false) {
      generateSingleEventPairs(event);
    } else {
      generateCyclicEventPairs(event);
    }
  }

  checkTypeOfEvent(event); // проверяем вид события
}

module.exports = pairsGenerator;
