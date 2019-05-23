const fs = require('fs');
const { MongoClient } = require('mongodb');

const copyDatabaseCollection = (
  mongoUri,
  databaseName,
  collectionName,
  path
) => {
  MongoClient.connect(
    mongoUri,
    (err, client) => {
      if (err !== null) throw err;
      let mongo;
      client
        .db(databaseName)
        .collection(`${collectionName}s`)
        .find()
        .toArray()
        .then(items => {
          fs.writeFile(path, JSON.stringify(items), error => {
            if (error) throw error;
            console.log(`
              ${collectionName} collection successfuly copied to ${path}!`);
          });
        });
    }
  );
};

module.exports = copyDatabaseCollection;
