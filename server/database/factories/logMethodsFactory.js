const LogSchema = require('../models/log');
const isNull = require('../../utilities/isNull');

function logMethodsFactory(logModelName) {
  if (isNull(logModelName)) {
    return {};
  }

  const Log = LogSchema(logModelName);

  const getAllLogs = (fields = null) => {
    return Log.find({}, fields).exec();
  };

  const getLogsByUserId = (userId, fields = null) => {
    return Log.find({ userId }, fields).exec();
  };

  const getLogsByType = (type, fields = null) => {
    return Log.find({ type }, fields).exec();
  };

  const postNewLog = log => {
    const newLog = new Log(log);

    return new Promise((resolve, reject) => {
      newLog.save((err, addedLog) => {
        if (err) reject(err);
        resolve(addedLog);
      });
    });
  };

  return {
    postNewLog,
    getAllLogs,
    getLogsByUserId,
    getLogsByType
  };
}

module.exports = logMethodsFactory;
