/* eslint-disable dot-notation */
const writeDatabase = require('./writeDatabase');
const readData = require('./readData');

const createTestDatabase = (mongoUri, projectName, collections) => {
  const folder = './../collectionBackups/';
  const extension = '.json';
  collections.forEach(collection => {
    const path = folder + collection + extension;
    readData(path).then(data => {
      writeDatabase(mongoUri, projectName, collection, data);
    });
  });
};

module.exports = createTestDatabase;
