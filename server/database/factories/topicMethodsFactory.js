const mongoose = require('mongoose');
const TopicSchema = require('../models/topic');
const isNull = require('../../utilities/isNull');

function topicMethodsFactory(topicModelName) {
  if (isNull(topicModelName)) {
    return {};
  }
  const Topics = TopicSchema(topicModelName);

  const getAllTopics = () => {
    return Topics.find({}).exec();
  };

  const getTopicById = topicId => {
    return Topics.findOne({
      _id: mongoose.Types.ObjectId(topicId)
    }).exec();
  };

  const postNewTopic = topic => {
    const newTopic = new Topics(topic);
    return new Promise((resolve, reject) => {
      newTopic.save((err, addedTopic) => {
        if (err) reject(err);
        resolve(addedTopic);
      });
    });
  };
  // новые методы //
  const makeActiveTopic = topicId => {
    return Topics.update({ _id: topicId }, { $set: { active: true } }, err =>
      console.log(err)
    );
  };
  const unActiveTopic = topicId => {
    return Topics.update({ _id: topicId }, { $set: { active: false } }, err =>
      console.log(err)
    );
  };
  const changeCyclicProp = (topicId, boolean) => {
    return Topics.update({ _id: topicId }, { $set: { cyclic: boolean } }, err =>
      console.log(err)
    );
  };
  const setLastEventsCreationDate = (topicId, timestamp) => {
    return Topics.update(
      { _id: topicId },
      { $set: { lastEventsCreationDate: timestamp } },
      err => console.log(err)
    );
  };
  const updateLastEventsCreationDate = (topicId, timestamp) => {
    return Topics.update(
      { _id: topicId },
      { $set: { lastEventsCreationDate: timestamp } },
      err => console.log(err)
    );
  };
  const getLastEventsCreationDate = (topicId, timestamp) => {
    return Topics.findOne(
      { _id: topicId, lastEventsCreationDate: timestamp },
      err => console.log(err)
    );
  };
  // ------------------------//
  const updateTopic = (topicId, newProps) => {
    return Topics.findOneAndUpdate(
      { _id: topicId },
      { $set: newProps },
      { useFindAndModify: false, new: true },
      (err, data) => data
    );
  };

  return {
    getAllTopics,
    getTopicById,
    postNewTopic,
    updateTopic,
    makeActiveTopic,
    unActiveTopic,
    changeCyclicProp,
    setLastEventsCreationDate,
    updateLastEventsCreationDate,
    getLastEventsCreationDate
  };
}

module.exports = topicMethodsFactory;
