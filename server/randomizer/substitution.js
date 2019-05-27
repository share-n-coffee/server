/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
const DBController = require('../database/dbController');
const countDaysRemained = require('./countDaysRemained');
const bot = require('../bot/telegramBot');

const controller = new DBController();

async function tryToSubsitute(eventId) {
  const event = await controller.getEventById(eventId);
  const daysRemained = countDaysRemained(event.date);
  if (daysRemained < 2) return;

  const subscribers = await controller.getAllSubscriptionsByTopicId(
    event.topicId
  );

  const availableSubscribers = subscribers.filter(subscriber => {
    return subscriber.visitsRemained > 0;
  });

  const usersToSubstitute = event.participants.filter(participant => {
    return participant.status === 'declined';
  });

  if (
    availableSubscribers.length < usersToSubstitute.length ||
    usersToSubstitute.length === 0
  )
    return;

  const availableUsers = [];
  const balancedUsers = [];

  for (let i = 0; i < event.participants.length; i++) {
    if (event.participants[i].status !== 'declined') {
      const selectedUser = await controller.getUserByUserId(
        event.participants[i].userId
      );
      balancedUsers.push(selectedUser);
    }
  }

  for (let i = 0; i < availableSubscribers.length; i++) {
    const availableUser = await controller.getUserByUserId(
      availableSubscribers[i].userId
    );
    availableUsers.push(availableUser);
  }

  function findAcceptableParticipants() {
    availableUsers.forEach(availableUser => {
      if (balancedUsers.length === event.participants.length) return;
      const userWasSelected = balancedUsers.find(balancedUser => {
        return balancedUser.id === availableUser.id;
      });

      const departmentWasSelected = balancedUsers.find(balancedUser => {
        return balancedUser.department === availableUser.department;
      });

      if (userWasSelected || departmentWasSelected) return;
      balancedUsers.push(availableUser);
    });
  }

  findAcceptableParticipants();

  if (balancedUsers.length !== event.participants.length) return;

  async function removeDeclinedParticipants() {
    for (const participant of event.participants) {
      if (participant.status === 'declined') {
        await controller.removeParticipant(eventId, participant.userId);
        await controller.removeUserEventByUserId(participant.userId, eventId);
      }
    }
  }

  removeDeclinedParticipants();

  async function addAcceptableParticipants() {
    for (const balancedUser of balancedUsers) {
      const isAlreadyInEvent = await event.participants.find(participant => {
        return participant.userId.toString() === balancedUser.id.toString();
      });

      if (!isAlreadyInEvent) {
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
        await controller.setUserStatusByEventId(
          event.id,
          balancedUser.id,
          'pending'
        );
      }
    }
  }

  addAcceptableParticipants();

  bot.mailing(event.id);
  return true;
}

module.exports = tryToSubsitute;
