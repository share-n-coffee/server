/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const DBController = require('../database/dbController');
const countDaysRemained = require('./countDaysRemained');
// const bot = require('../bot/telegramBot');

const controller = new DBController();

async function addParticipants(event, usersLimit = 2) {
  if (event.participants.length >= usersLimit) return;
  const daysRemained = countDaysRemained(event.date);
  if (daysRemained < 2) return;

  const subscribers = await controller.getAllSubscriptionsByTopicId(
    event.topicId
  );
  const availableSubscribers = subscribers.filter(subscriber => {
    return subscriber.visitsRemained !== 0;
  });

  if (availableSubscribers.length < usersLimit) return;

  const availableUsersAmount = availableSubscribers.length;
  const availableUsers = [];
  const balancedUsers = [];

  for (let i = 0; i < availableSubscribers.length; i++) {
    const availableUser = await controller.getUserByUserId(
      availableSubscribers[i].userId
    );
    availableUsers.push(availableUser);
  }

  function getRandomUser(max) {
    return Math.floor(Math.random() * max);
  }

  const selectedSubscription =
    availableSubscribers[getRandomUser(availableUsersAmount)];
  const selectedUser = await controller.getUserByUserId(
    selectedSubscription.userId
  );
  balancedUsers.push(selectedUser);

  availableUsers.forEach(availableUser => {
    if (balancedUsers.length === usersLimit) return;
    const userWasSelected = balancedUsers.find(balancedUser => {
      return balancedUser.id === availableUser.id;
    });

    const departmentWasSelected = balancedUsers.find(balancedUser => {
      return balancedUser.department === availableUser.department;
    });

    if (userWasSelected || departmentWasSelected) return;
    balancedUsers.push(availableUser);
  });

  if (balancedUsers.length !== usersLimit) return;

  for (const balancedUser of balancedUsers) {
    await controller.addParticipant(event.id, balancedUser.id);
    const visitsRemained = await controller.getVisitsRemainedQuantity(
      event.topicId,
      balancedUser.id
    );

    await controller.setVisitsRemainedQuantity(
      event.topicId,
      balancedUser.id,
      visitsRemained[0].visitsRemained - 1
    );

    await controller.putUserEventByUserId(balancedUser.id, event.id);
    await controller.setUserStatusByEvent(event.id, balancedUser.id, 'pending');
  }
  // bot.mailing(event.id);
  console.log(
    `participants for topic ${event.topicId} for event ${
      event.id
    } have been added`
  );
}

module.exports = addParticipants;
