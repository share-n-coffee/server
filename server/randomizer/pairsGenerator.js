const checkDBMapping = require('./checkDBMapping');
const checkUserFields = require('./checkUserFields');
const EEmitter = require('../coupling/events');

function pairsGenerator(allData) {
  const eventsData = allData[0];
  const departmentsData = allData[1];
  const events = {};
  const usersParticipation = {};
  const generatedPairs = {};
  const reservedUsers = {};
  let usersData = allData[2];

  usersData = checkUserFields(usersData); // проверяем наличие отдела и запланированных событий
  checkDBMapping(eventsData, departmentsData, usersData); // проверяем, что id отдела и событий у юзера соответствуют базе данных

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

  generateEvents(); // генерируем основную структуру событий

  function generateUsersParticipation(timesPerPeriod = 1) {
    usersData.forEach(user => {
      usersParticipation[user.telegramUserId] = {
        username: user.username,
        visitsRemain: timesPerPeriod
      };
    });
  }

  generateUsersParticipation(); // генерируем вспомогательный массив юзеров

  function checkUsersParticipation(eventId, event) {
    Object.entries(event).forEach(department => {
      const remainedUsers = department[1].filter(user => {
        return usersParticipation[user].visitsRemain !== 0;
      });
      events[eventId][department[0]] = remainedUsers;
    });
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
        usersWithoutPair.push(user);
      }
    });

    return {
      eventPairs,
      usersWithoutPair
    };
  }

  function confirmReservedUsers() {
    Object.entries(reservedUsers).forEach(eventReservedUsers => {
      const remainedUsers = eventReservedUsers[1].filter(reservedUser => {
        return (
          usersParticipation[reservedUser.telegramUserId].visitsRemain !== 0
        );
      });
      reservedUsers[eventReservedUsers[0]] = remainedUsers;
    });
  }

  function generatePairs() {
    Object.entries(events).forEach(event => {
      checkUsersParticipation(event[0], event[1]); // оставляем для генерации пар только тех юзеров, кто еще может принимать участие в данном периоде

      const availableUsersList = generateEventUsersList(event[1]); // собираем список подписчиков события из всех отделов

      const result = generateEventPairs(availableUsersList); // генерируем пары

      generatedPairs[event[0]] = result.eventPairs;
      reservedUsers[event[0]] = result.usersWithoutPair;

      console.log(`end pairs generation for event ${event[0]}`);
    });

    confirmReservedUsers(); // проверяем возможность посещения событий для юзеров, добавленных в резерв

    console.log('Generated Pairs:', generatedPairs);
    console.log('Users Participation for current period:', usersParticipation);
    console.log('Reserved Users for Events:', reservedUsers);

    EEmitter.emit('pairs generated', generatedPairs); // генерируем событие 'pairs generated'(потом всунем куда надо);

    process.exit(0);
  }

  generatePairs(); // вызов генерации пар
}

module.exports = pairsGenerator;