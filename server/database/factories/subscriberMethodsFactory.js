const SubscriberSchema = require('../models/user');
const isString = require('../../utilities/isString');

function subscriberMethodsFactory(subscriberModelName) {
  if (!isString(subscriberModelName)) {
    throw new TypeError('subscriberModelName should be a String');
  }
  const Subscribers = SubscriberSchema(subscriberModelName);

  const createSubscriber = (topicId, userTelegramId, visitsRemained) => {
    return Subscribers.create({
      topicId,
      userTelegramId,
      visitsRemained
    });
  };

  const getSubscriberByTopicId = topicId => {
    return Subscribers.find({ topicId }).exec();
  };

  const getSubscriberByUserTelegramId = userTelegramId => {
    return Subscribers.find({ userTelegramId }).exec();
  };

  const getAllSubscribers = () => {
    return Subscribers.find({}).exec();
  };

  const removeSubscriber = (topicId, userTelegramId) => {
    return Subscribers.deleteOne({ topicId, userTelegramId });
  };

  const getVisitsRemainedQuantity = (topicId, userTelegramId) => {
    return Subscribers.find(
      { topicId, userTelegramId },
      'visitsRemained'
    ).exec();
  };

  const setVisitsRemainedQuantity = (topicId, userTelegramId, newQuantity) => {
    return Subscribers.updateOne(
      { topicId, userTelegramId },
      { $set: { visitsRemained: newQuantity } }
    );
  };

  return {
    createSubscriber,
    getSubscriberByTopicId,
    getSubscriberByUserTelegramId,
    getAllSubscribers,
    removeSubscriber,
    getVisitsRemainedQuantity,
    setVisitsRemainedQuantity
  };
}

module.exports = subscriberMethodsFactory;
