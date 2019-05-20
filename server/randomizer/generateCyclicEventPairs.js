/* eslint-disable no-param-reassign */
const DBController = require('../database/dbController');
const bot = require('../bot/telegramBot');

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

// генерируем пары для циклического события
async function generateCyclicEventPairs(event) {
  const usersStatusUpdate = []; // для запроса на обновление статусов пользователей
  const generatedPairs = []; // сформированные пары
  const availableDates = [];
  const usersParticipation = {}; // для регулирования ежемесячного участия
  const availableUsers = await generateEventUsersList(event); // собираем список всех свободных подписчиков события из всех отделов

  function generateUsersParticipation(visits = 1) {
    availableUsers.forEach(user => {
      usersParticipation[user.telegramUserId] = {
        username: user.username,
        visitsRemain: visits
      };
    });
  }

  generateUsersParticipation(); // генерируем вспомогательный массив юзеров

  console.log(new Date(event.options.nextDates[3]));

  // console.log(usersParticipation);

  // console.log(event);

  function checkAvailableDatesForPairs() {
    const currentDate = new Date();
    event.options.nextDates.forEach(date => {
      const sheduleDate = new Date(date);
      const diff = sheduleDate - currentDate;
      if (diff > 24 * 60 * 60 * 1000) {
        availableDates.push(sheduleDate);
      }
    });
  }

  checkAvailableDatesForPairs();

  function datesGenerator() {
    let dateIndex = 0;
    return function chooseDateForPair() {
      const datesCount = availableDates.length;
      const chosenDate = availableDates[dateIndex];
      if (dateIndex >= datesCount - 1) {
        dateIndex = 0;
      } else {
        dateIndex += 1;
      }
      return chosenDate;
    };
  }

  const chooseDateForPair = datesGenerator();

  console.log(availableDates);
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
        date: chooseDateForPair()
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

  bot.mailing(event.id);
}

module.exports = generateCyclicEventPairs;
