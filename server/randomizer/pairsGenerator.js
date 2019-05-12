const checkDBMapping = require('./checkDBMapping');

function pairsGenerator(allData) {
  const eventsData = allData[0];
  const departmentsData = allData[1];
  const usersData = allData[2];
  const events = {};
  const usersParticipation = {};
  const generatedPairs = {};
  const reservedUsers = {};

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

  function generateEventPairs(availableUsersList) {
    const eventPairs = [];
    const users = availableUsersList;
    const usersWithoutPair = [];
    users.forEach(balancedUser => {
      if (balancedUser.isPaired === true) return;

      users.forEach(user => {
        if (balancedUser.telegramUserId === user.telegramUserId) return;
        if (balancedUser.departmentId === user.departmentId) return;
        if (user.isPaired === true || balancedUser.isPaired === true) return;
        const pair = {};
        pair.invitedUser1 = balancedUser.telegramUserId;
        pair.invitedUser2 = user.telegramUserId;
        eventPairs.push(pair);
        balancedUser.isPaired = true;
        usersParticipation[balancedUser.telegramUserId].visitsRemain--;
        user.isPaired = true;
        usersParticipation[user.telegramUserId].visitsRemain--;
      });
    });

    users.forEach(user => {
      if (user.isPaired === false) {
        reservedUsers.push(user);
      }
    });

    return {
      eventPairs,
      usersWithoutPair
    };
  }

  function generatePairs() {
    Object.entries(events).forEach(event => {
      checkUsersParticipation(event[0], event[1]);

      const availableUsersList = generateEventUsersList(event[1]);

      const result = generateEventPairs(availableUsersList);

      generatedPairs[event[0]] = result.eventPairs;
      reservedUsers[event[0]] = result.usersWithoutPair;

      console.log(`end pairs generation for event ${event[0]}`);
    });

    console.log(generatedPairs);
    console.log(usersParticipation);
    process.exit(0);
  }

  generatePairs();
}

module.exports = pairsGenerator;
