/* eslint-disable dot-notation */
// const connectDatabase = require('./../../../server/lib/connectDatabase');
const copyDatabaseCollection = require('./copyDatabaseCollection');

function copyDatabase(sourceMongoUri, db, folder) {
  const projectName = db.project;
  const collections = Object.values(db).filter(item => item !== projectName);

  // save each collection into backup files
  collections.forEach(collection => {
    copyDatabaseCollection(sourceMongoUri, projectName, collection, folder);
  });
}

module.exports = copyDatabase;
