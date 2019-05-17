const UserSchema = require('../models/user');
const isNull = require('./isNull');

function userMethodsFactory(userModelName) {
  if (isNull(userModelName)) {
    return {};
  }
  const Users = UserSchema(userModelName);

  const getAllUsers = () => {
    return Users.find({}).exec();
  };

  const getUserByTelegramId = id => {
    return Users.findOne({ telegramUserId: id }).exec();
  };

  const getUserById = id => {
    return Users.findOne({ _id: id }).exec();
  };

  const putUserTelegramChatId = (userId, telegramChatId) => {
    return Users.findOneAndUpdate(
      { _id: userId },
      { $set: { telegramChatId } },
      { useFindAndModify: false, new: true },
      (err, data) => data
    );
  };

  const putUserDepartment = (userId, department) => {
    return Users.findOneAndUpdate(
      { _id: userId },
      { $set: { department } },
      { useFindAndModify: false, new: true },
      (err, data) => data
    );
  };

  const postNewUser = user => {
    const newUser = new Users(user);

    return new Promise((resolve, reject) => {
      newUser.save((err, addedUser) => {
        if (err) reject(err);
        resolve(addedUser);
      });
    });
  };

  const getAllUsersByEventId = id => {
    return Users.find({ 'events.eventId': id }).exec();
  };

  return {
    getAllUsers,
    getUserByTelegramId,
    getUserById,
    putUserTelegramChatId,
    putUserDepartment,
    postNewUser,
    getAllUsersByEventId
  };
}

module.exports = userMethodsFactory;
