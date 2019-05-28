const mongoose = require('mongoose');
const TopicSchema = require('../models/topic');
const isNull = require('../../utilities/isNull');

function topicMethodsFactory(topicModelName) {
  if (isNull(topicModelName)) {
    return {};
  }
  const Topics = TopicSchema(topicModelName);

  const findTopics = req =>
    Topics.find(req.query, req.fields, {
      ...req.sorting,
      ...req.pagination
    });

  const findOneTopic = (query, fields = null) =>
    Topics.findOne(query, fields).exec();

  const countTopics = () => Topics.find({}).count();

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
  const makeTopicActive = topicId => {
    return Topics.updateOne(
      { _id: mongoose.Types.ObjectId(topicId) },
      { $set: { active: true } },
      err => {
        if (err) console.log(err);
      }
    );
  };
  const makeTopicInactive = topicId => {
    return Topics.updateOne(
      { _id: mongoose.Types.ObjectId(topicId) },
      { $set: { active: false } },
      err => {
        if (err) console.log(err);
      }
    );
  };
  const changeCyclicProp = (topicId, boolean) => {
    return Topics.updateOne(
      { _id: mongoose.Types.ObjectId(topicId) },
      { $set: { cyclic: boolean } },
      err => {
        if (err) console.log(err);
      }
    );
  };
  const setLastEventsCreationDate = (topicId, timestamp) => {
    return Topics.updateOne(
      { _id: mongoose.Types.ObjectId(topicId) },
      { $set: { lastEventsCreationDate: timestamp } },
      err => {
        if (err) console.log(err);
      }
    );
  };
  const updateLastEventsCreationDate = (topicId, timestamp) => {
    return Topics.updateOne(
      { _id: mongoose.Types.ObjectId(topicId) },
      { $set: { lastEventsCreationDate: timestamp } },
      err => {
        if (err) console.log(err);
      }
    );
  };
  const getLastEventsCreationDate = topicId => {
    return Topics.findOne({ _id: topicId }, 'lastEventsCreationDate', err => {
      if (err) console.log(err);
    }).exec();
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
    makeTopicActive,
    makeTopicInactive,
    changeCyclicProp,
    setLastEventsCreationDate,
    updateLastEventsCreationDate,
    getLastEventsCreationDate,
    findTopics,
    findOneTopic,
    countTopics
  };
}

module.exports = topicMethodsFactory;
