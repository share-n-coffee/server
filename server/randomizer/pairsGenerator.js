const checkDBMapping = require('./checkDBMapping');

function pairsGenerator(allData) {
  const eventsData = allData[0];
  const departmentsData = allData[1];
  const usersData = allData[2];
  const events = {};
  const usersParticipation = {};

  checkDBMapping(eventsData, departmentsData, usersData);

  function generateEvents() {
    eventsData.forEach(event => {
      events[event.id] = {};
    });

    usersData.forEach(user => {
      user.events.forEach(userEvent => {
        if (events[userEvent][user.department]) {
          events[userEvent][user.department].push(user.telegramUserId);
        } else {
          events[userEvent][user.department] = [user.telegramUserId];
        }
      });
    });

    console.log(events);
  }

  generateEvents();

  function generateUsersParticipation(timesPerPeriod = 1) {
    usersData.forEach(user => {
      usersParticipation[user.telegramUserId] = {
        username: user.username,
        visitsRemain: timesPerPeriod
      };
    });
  }

  generateUsersParticipation();
}

module.exports = pairsGenerator;
