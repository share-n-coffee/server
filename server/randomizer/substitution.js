/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const DBController = require('../database/dbController');

const controller = new DBController();

async function addNewPairs(eventId) {
  const eventToBalance = await controller.getEventById(eventId);
  const allUsers = await controller.getAllUsersByEventId(eventId);

  function generateEventUsersList(event) {
    const usersList = [];

    allUsers.forEach(user => {
      const availableUser = user.events.find(userEvent => {
        return userEvent.status === 'free';
      });

      if (availableUser) {
        usersList.push(user);
      }
    });

    return usersList;
  }

  // генерируем дополнительные пары
  async function generateAdditionalPairs(event) {
    const usersStatusUpdate = []; // для запроса на обновление статусов пользователей
    const generatedPairs = []; // сформированные дополнительные пары для добавления
    const availableUsers = generateEventUsersList(event); // собираем список всех свободных подписчиков события из всех отделов

    if (availableUsers.length < 2) {
      return console.log(`any pairs to event ${eventId} was not added`);
    }

    availableUsers.forEach(balancedUser => {
      let balancedUserStatus = balancedUser.events.find(userEvent => {
        return event.id.toString() === userEvent.eventId.toString();
      }).status;

      const balancedUserEventIndex = balancedUser.events.findIndex(
        userEvent => {
          return event.id.toString() === userEvent.eventId.toString();
        }
      );

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
          date: event.options.nextDate
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
    await generatedPairs.forEach(pair => {
      controller.insertPair(event.id, pair);
    });
    console.log(generatedPairs);

    // нужно вызвать метод добавления объектов пар в массив пар конкретного события
    // здесь нужно вызывать бота для передачи id события
    if (generatedPairs.length !== 0) {
      console.log(`new pairs to event ${eventId} added`);
    } else {
      console.log(`any pairs to event ${eventId} was not added`);
    }
  }

  generateAdditionalPairs(eventToBalance); // вызов генерации дополнительных пар
}

module.exports = addNewPairs;
