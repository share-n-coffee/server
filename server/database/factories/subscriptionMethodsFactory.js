const SubscriptionSchema = require('../models/subscription');
const isString = require('../../utilities/isString');

function subscriptionMethodsFactory(subscriptionModelName) {
  if (!isString(subscriptionModelName)) {
    throw new TypeError('subscriptionModelName should be a String');
  }
  const Subscriptions = SubscriptionSchema(subscriptionModelName);

  const createSubscription = (topicId, userTelegramId, visitsRemained) => {
    return Subscriptions.create({
      topicId,
      userTelegramId,
      visitsRemained
    });
  };

  const getSubscriptionByTopicId = topicId => {
    return Subscriptions.find({ topicId }).exec();
  };

  const getSubscriptionByUserTelegramId = userTelegramId => {
    return Subscriptions.find({ userTelegramId }).exec();
  };

  const getAllSubscriptions = () => {
    return Subscriptions.find({}).exec();
  };

  const removeSubscription = (topicId, userTelegramId) => {
    return Subscriptions.deleteOne({ topicId, userTelegramId });
  };

  const getVisitsRemainedQuantity = (topicId, userTelegramId) => {
    return Subscriptions.find(
      { topicId, userTelegramId },
      'visitsRemained'
    ).exec();
  };

  const setVisitsRemainedQuantity = (topicId, userTelegramId, newQuantity) => {
    return Subscriptions.updateOne(
      { topicId, userTelegramId },
      { $set: { visitsRemained: newQuantity } }
    );
  };

  return {
    createSubscription,
    getSubscriptionByTopicId,
    getSubscriptionByUserTelegramId,
    getAllSubscriptions,
    removeSubscription,
    getVisitsRemainedQuantity,
    setVisitsRemainedQuantity
  };
}

module.exports = subscriptionMethodsFactory;
