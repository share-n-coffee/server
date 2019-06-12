const fs = require('fs');
const { MongoClient } = require('mongodb');

const copyDatabaseCollection = (
  mongoUri,
  databaseName,
  collectionName,
  folder
) => {
  const collection = `${collectionName}s`;
  MongoClient.connect(
    mongoUri,
    { useNewUrlParser: true },
    (err, client) => {
      if (err) throw err;
      client
        .db(databaseName)
        .collection(collection)
        .find()
        .toArray()
        .then(items => {
          const extension = '.json';
          const path = folder + collection + extension;
          fs.writeFile(path, JSON.stringify(items), { flag: 'w' }, error => {
            if (error) throw error;
            fs.readFile(path, 'utf-8', readError => {
              if (readError) throw readError;
              console.log(`
              ${collectionName} collection successfuly copied to ${path}!`);
            });
            client.close();
          });
        });
    }
  );
};

module.exports = copyDatabaseCollection;
