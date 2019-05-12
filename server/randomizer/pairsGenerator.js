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

  function checkUsersParticipation(eventId, event) {
    Object.entries(event).forEach(department => {
      const remainedUsers = department[1].filter(user => {
        return usersParticipation[user].visitsRemain !== 0;
      });
      events[eventId][department[0]] = remainedUsers;
    });

    return event;
  }

  function generateEventUsersList(event) {
    const usersList = [];

    Object.entries(event).forEach(department => {
      department[1].forEach(telegramUserId => {
        const user = {};
        user.telegramUserId = telegramUserId;
        user.departmentId = department[0];
        user.isPaired = false;
        usersList.push(user);
      });
    });

    return usersList;
  }

  function generatePairs() {
    Object.entries(events).forEach(event => {
      checkUsersParticipation(event[0], event[1]);
      const availableUsersList = generateEventUsersList(event[1]);
      console.log('end event');
    });

    process.exit(0);
  }

  generatePairs();
}

module.exports = pairsGenerator;
