const SubscriptionSchema = require('../models/subscription');
const isString = require('../../utilities/isString');

function subscriptionMethodsFactory(subscriptionModelName) {
  if (!isString(subscriptionModelName)) {
    throw new TypeError('subscriptionModelName should be a String');
  }
  const Subscriptions = SubscriptionSchema(subscriptionModelName);

  const createSubscription = (topicId, userId, visitsRemained) => {
    return Subscriptions.create({
      topicId,
      userId,
      visitsRemained
    });
  };

  const getAllSubscriptionsByTopicId = topicId => {
    return Subscriptions.find({ topicId })
      .lean()
      .exec();
  };

  const getAllSubscriptionsByUserId = userId => {
    return Subscriptions.find({ userId })
      .lean()
      .exec();
  };

  const getAllSubscriptions = () => {
    return Subscriptions.find({})
      .lean()
      .exec();
  };

  const removeSubscription = (topicId, userId) => {
    return Subscriptions.deleteOne({ topicId, userId });
  };

  const getVisitsRemainedQuantity = (topicId, userId) => {
    return Subscriptions.find({ topicId, userId }, 'visitsRemained').exec();
  };

  const setVisitsRemainedQuantity = (topicId, userId, visitQuantity) => {
    return Subscriptions.updateOne(
      { topicId, userId },
      { $set: { visitsRemained: visitQuantity } }
    );
  };

  return {
    createSubscription,
    getAllSubscriptionsByTopicId,
    getAllSubscriptionsByUserId,
    getAllSubscriptions,
    removeSubscription,
    getVisitsRemainedQuantity,
    setVisitsRemainedQuantity
  };
}

module.exports = subscriptionMethodsFactory;
