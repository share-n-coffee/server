/* eslint-disable dot-notation */
const mongoose = require('mongoose');
const connectDatabase = require('../../../server/lib/connectDatabase');
const ClassController = require('../../../server/database/dbController');

const controller = new ClassController();
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
});
