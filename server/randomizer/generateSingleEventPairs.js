/* eslint-disable no-param-reassign */
const DBController = require('../database/dbController');

const controller = new DBController();

async function generateEventUsersList(event) {
  const usersList = [];
  const eventUsers = await controller
    .getAllUsersByEventId(event.id)
    .catch(error => {
      console.log(error);
    });
  eventUsers.forEach(user => {
    const availableUser = user.events.find(userEvent => {
      return userEvent.status === 'free';
    });

    if (availableUser) {
      usersList.push(user);
    }
  });

  return usersList;
}

// генерируем пары для одиночного события
async function generateSingleEventPairs(event) {
  const usersStatusUpdate = []; // для запроса на обновление статусов пользователей
  const generatedPairs = [];
  const availableUsers = await generateEventUsersList(event); // собираем список всех свободных подписчиков события из всех отделов

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
        date: event.options.nextDate // в новой схеме обращаться через options к первому элементу массива nextDates
      };
      generatedPairs.push(pair);
      balancedUser.events[balancedUserEventIndex].status = 'pending';
      user.events[userEventIndex].status = 'pending';

      const balancedUserStatusUpdate = {};
      balancedUserStatusUpdate[balancedUser.telegramUserId] = {
        [event.id]: 'pending'
      };
      usersStatusUpdate.push(balancedUserStatusUpdate);

      const userStatusUpdate = {};
      userStatusUpdate[user.telegramUserId] = {
        [event.id]: 'pending'
      };
      usersStatusUpdate.push(userStatusUpdate);
    });
  });
  console.log(usersStatusUpdate);
  await controller.setEventStatus(usersStatusUpdate).catch(error => {
    console.log(error);
  });

  const eventPairs = {};
  eventPairs.eventId = event.id;
  eventPairs.pairs = generatedPairs;

  await controller.insertEventPairs(eventPairs);

  // здесь нужно вызывать бота для передачи id события
}

module.exports = generateSingleEventPairs;
