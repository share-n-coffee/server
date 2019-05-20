/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const config = require('../../../server/config/config');
const connectDatabase = require('../../../server/lib/connectDatabase');
const ClassController = require('../../../server/database/dbController');
// const collectionConfig = require('./collection');

const controller = new ClassController('event');
const testData = {
  userTelegramId: undefined,
  eventId: undefined,
  departmentId: undefined
};
connectDatabase();

describe('dbController tests', () => {
  it('config test', () => {
    expect(controller).toBeTruthy();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log('tests done, May the Force be with you young Jedi');
  });

  test('Get all Events', done => {
    function cb(controllerEvents, mongoEventsCount) {
      testData.eventId = controllerEvents[0]['_id'];

      expect(controllerEvents).toHaveLength(mongoEventsCount);
      done();
    }
    MongoClient.connect(
      config.database,
      (err, client) => {
        client
          .db('demoproject')
          .collection('demo_events')
          .find({})
          .count((error, mongoEventsCount) => {
            client.close();
            controller.getAllEvents().then(controllerEvents => {
              cb(controllerEvents, mongoEventsCount);
            });
          });
      }
    );
  });

  test('GET Event by _id', done => {
    function cb(event) {
      expect(event).toHaveProperty('description');
      done();
    }

    controller.getEventById(testData.eventId).then(event => {
      cb(event);
    });
  });
});
