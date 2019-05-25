/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const DBController = require('../database/dbController');

const controller = new DBController();

/* async function restoreVisits(topic, visitsRemained = 1) {
  // Admin should be able to change visitsRemained param
  if (!topic.lastEventsCreationDate) return;
  const eventsRemainingThisMonth = await controller.getEventsByTopic(topic.id);
  if (eventsRemainingThisMonth.length === 0) {
    const subscribers = await controller.getAllSubscriptionsByTopicId(topic.id);
    for (const subscriber of subscribers) {
      await controller.setVisitsRemainedQuantity(
        topic.id,
        subscriber.userId,
        visitsRemained
      );
    }
  }
}

module.exports = restoreVisits;
*/
