const { MongoClient } = require('mongodb');
const config = require('../server/config/config');

describe('Initial tests', () => {
  it('config test', () => {
    expect(config).toBeTruthy();
  });
});

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(
      config.database,
      {
        useNewUrlParser: true
      }
    );
    db = await connection.db('demoproject');
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('test');

    const mockUser = { _id: 'some-user-id', name: 'John' };
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: 'some-user-id' });
    expect(insertedUser).toEqual(mockUser);
  });

  it('should remove a doc from collection', async () => {
    const users = db.collection('test');

    const mockUser = { _id: 'some-user-id', name: 'John' };
    await users.deleteOne(mockUser);

    const insertedUser = await users.findOne({ _id: 'some-user-id' });
    expect(insertedUser).toBeFalsy();
  });
});
