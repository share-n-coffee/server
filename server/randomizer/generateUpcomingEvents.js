const express = require('express');
const connectDatabase = require('../../server/lib/connectDatabase');
const ClassDBController = require('../database/dbController');

const app = express();
const port = 9000;

function generateUpcomingEvents(period = 'month') {
  const periodDays =
    period === 'month'
      ? new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()
      : 7;

  const endTime = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    0
  ).getTime();
  const startTime = endTime - periodDays * 24 * 60 * 60;
  console.log('generate');
}

// module.exports = generateUpcomingEvents;

connectDatabase();
app.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);

  const DBController = new ClassDBController('event');
  DBController.getAllEvents()
    .then(events => console.log(events))
    .catch(error => console.log(error));
});
