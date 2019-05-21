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
    updateTopic
  };
}

module.exports = topicMethodsFactory;
