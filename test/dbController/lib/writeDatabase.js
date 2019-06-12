const { MongoClient } = require('mongodb');

const writeDatabase = (mongoUri, databaseName, collectionName, data) => {
  MongoClient.connect(
    mongoUri,
    { useNewUrlParser: true },
    (err, client) => {
      if (err) throw err;
      client
        .db(databaseName)
        .collection(collectionName)
        .deleteMany({})
        .then(deleteError => {
          if (deleteError) throw deleteError;
          console.log(
            `${collectionName} collection has been successfuly deleted`
          );
        });
      client
        .db(databaseName)
        .collection(collectionName)
        .insertMany(data)
        .then(error => {
          if (error) throw error;
          console.log(
            `${collectionName} collection has been wtiten successfuly to database ${databaseName}!`
          );
        })
        .catch(insertError => {
          console.log('insertMany error:', insertError);
        });
      client.close();
    }
  );
};

module.exports = writeDatabase;
