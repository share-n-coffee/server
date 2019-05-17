/* eslint-disable no-param-reassign */
const DBController = require('../database/dbController');

const controller = new DBController();

function generateEventUsersList(event, allUsers) {
  const usersList = [];

  allUsers.forEach(user => {
    const availableUser = user.events.find(userEvent => {
      return (
        event.id.toString() === userEvent.eventId.toString() &&
        userEvent.status === 'free'
      );
    });

    if (availableUser) {
      usersList.push(user);
    }
  });

  return usersList;
}

// генерируем пары для одиночного события
function generateSingleEventPairs(event, allUsers) {
  const finalPairsObjects = [];
  const generatedPairs = [];
  const availableUsers = generateEventUsersList(event, allUsers); // собираем список всех свободных подписчиков события из всех отделов
  // console.log(availableUsers);
  availableUsers.forEach(balancedUser => {
    let balancedUserStatus = balancedUser.events.find(userEvent => {
      return event.id.toString() === userEvent.eventId.toString();
    }).status;

    const balancedUserEventIndex = balancedUser.events.findIndex(userEvent => {
      return event.id.toString() === userEvent.eventId.toString();
    });

    if (balancedUserStatus !== 'free') return;

    availableUsers.forEach(user => {
      balancedUserStatus = balancedUser.events.find(userEvent => {
        return event.id.toString() === userEvent.eventId.toString();
      }).status;

      const userStatus = user.events.find(userEvent => {
        return event.id.toString() === userEvent.eventId.toString();
      }).status;

      const userEventIndex = user.events.findIndex(userEvent => {
        return event.id.toString() === userEvent.eventId.toString();
      });

      if (balancedUser.telegramUserId === user.telegramUserId) return;

      if (balancedUser.department === user.department) return;

      if (userStatus !== 'free' || balancedUserStatus !== 'free') return;

      const pair = {};
      pair.invitedUser1 = balancedUser.telegramUserId;
      pair.invitedUser2 = user.telegramUserId;
      pair.event = {
        location: event.location,
        title: event.title,
        description: event.description,
        date: event.event.nextDate // в новой схеме обращаться через options к первому элементу массива nextDates
      };
      generatedPairs.push(pair);
      balancedUser.events[balancedUserEventIndex].status = 'pending';
      user.events[userEventIndex].status = 'pending';
    });
  });

  const eventPairs = {};
  eventPairs.eventId = event.id;
  eventPairs.pairs = generatedPairs;
  finalPairsObjects.push(eventPairs);

  controller.insertEventPairs(finalPairsObjects);
  // здесь нужно вызывать бота для передачи id события
}

module.exports = generateSingleEventPairs;
