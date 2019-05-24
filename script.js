/* eslint-disable no-underscore-dangle */
const { MongoClient } = require('mongodb');
require('dotenv').config();

const URI = process.env.NODE_MONGODB_URI2;
const topicQuery =
  {
    title: process.argv[2]
  } || {};
const visits = process.argv[3] || 1;
const userQuery = process.argv[4] || {};

async function subscribe() {
  try {
    const connection = await MongoClient.connect(
      URI,
      {
        useNewUrlParser: true
      }
    );
    const db = await connection.db('random-coffee');
    const topics = await db.collection('topics');
    const users = await db.collection('users');
    const subscriptions = await db.collection('subscriptions');

    const currentTopic = await topics.findOne(topicQuery);
    const currentUsers = await users.find(userQuery);

    const usersArray = await currentUsers.toArray();

    const subscriptionArray = usersArray.map(({ _id }) => {
      return {
        topicId: currentTopic._id,
        userId: _id,
        visitsRemained: visits
      };
    });

    const insert = await subscriptions.insertMany(subscriptionArray);
    // const deleten = await subscriptions.deleteMany({
    //   topicId: '5cd6f6c381371d297acb2fd8'
    // });
    console.log(insert);

    await connection.close();
    await db.close();
  } catch (e) {
    console.error(`Error in controlPanel: ${e}`);
  }
}

async function showTopics() {
  try {
    const connection = await MongoClient.connect(
      URI,
      {
        useNewUrlParser: true
      }
    );
    const db = await connection.db('random-coffee');
    const topics = await db.collection('topics');

    const cursor = await topics.find(
      {},
      {
        projection: {
          title: 1
        }
      }
    );
    const allTopics = await cursor.toArray();

    console.log(allTopics);
    console.log([
      'first argument - topic title',
      'second argument - visits quantyty ',
      'third argument - userQuery'
    ]);

    await connection.close();
    await db.close();
  } catch (e) {
    console.error(`Error in showTopics: ${e}`);
  }
}

if (process.argv[2] === undefined) {
  showTopics();
} else {
  console.log(userQuery);
  subscribe();
}
