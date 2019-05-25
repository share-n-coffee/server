const UserSchema = require('../models/user');
const isString = require('../../utilities/isString');

function userMethodsFactory(userModelName) {
  if (!isString(userModelName)) {
    throw new TypeError('userModelName should be a String');
  }

  const Users = UserSchema(userModelName);

  const findUsers = (
    query,
    fields = null,
    sorting = null,
    skip = 0,
    limit = 0
  ) => Users.find(query, fields, { ...sorting, skip, limit }).exec();

  const findOneUser = (query, fields = null) =>
    Users.findOne(query, fields).exec();

  const getAllUsers = (fields = null, sorting) => {
    return Users.find({}, fields, sorting).exec();
  };

  const getUserByUserId = (_id, fields = null) => {
    return Users.findOne({ _id }, fields).exec();
  };

  const getUserByTelegramId = (telegramId, fields = null) => {
    return Users.findOne({ telegramId }, fields).exec();
  };

  const createNewUser = user => {
    const newUser = {
      firstName: user.first_name,
      lastName: user.last_name,
      telegramId: user.id,
      avatar: user.photo_url,
      username: user.username
    };
    return Users.findOneAndUpdate(
      { telegramId: newUser.telegramId },
      { $set: newUser },
      { upsert: true }
    );
  };

  const updateUserInfoByUserId = (_id, info) => {
    return Users.findOneAndUpdate(
      { _id },
      {
        $set: {
          firstName: info.first_name,
          lastName: info.last_name,
          avatar: info.photo_url,
          username: info.username
        }
      }
    );
  };

  const removeUserByUserId = _id => {
    return Users.deleteOne({ _id });
  };

  const getAllUsersByEventId = (id, fields = {}, sorting = {}) => {
    return Users.find({ 'events.eventId': id }, fields, sorting).exec();
  };

  const putUserEventByUserId = (_id, eventId) => {
    return Users.updateOne(
      { _id },
      { events: { $push: { eventId } } },
      { upsert: true }
    );
  };

  const getAllUserEventsByUserId = _id => {
    return Users.findOne({ _id }, { events: 1 }).exec();
  };

  const removeUserEventByUserId = (_id, eventId) => {
    return Users.updateOne({ _id }, { $pull: { events: { eventId } } });
  };

  const removeAllUserEventsByUserId = _id => {
    return Users.updateOne({ _id }, { $set: { events: [] } });
  };

  const setUserDepartmentByUserId = (_id, departmentId) => {
    return Users.updateOne({ _id }, { $set: { departmentId } });
  };

  const getUserDepartmentByUserId = _id => {
    return Users.find({ _id }, 'department').exec();
  };

  const banUserByUserId = (_id, duration) => {
    return Users.updateOne(
      { _id },
      { $set: { banned: true, expired: Date.now() + duration } }
    );
  };

  const unbanUserByUserId = _id => {
    return Users.updateOne({ _id }, { $set: { banned: false, expired: null } });
  };

  const assignAdminByUserId = (_id, password) => {
    return Users.updateOne(
      { _id },
      { $set: { 'admin.isAdmin': true, 'admin.password': password } }
    );
  };

  const dischargeAdminByUserId = _id => {
    return Users.updateOne({ _id }, { $set: { 'admin.isAdmin': false } });
  };

  return {
    getAllUsers,
    getAllUsersByEventId,
    findUsers,
    getUserByTelegramId,
    createNewUser,
    updateUserInfoByUserId,
    removeUserByUserId,
    putUserEventByUserId,
    getAllUserEventsByUserId,
    removeUserEventByUserId,
    removeAllUserEventsByUserId,
    setUserDepartmentByUserId,
    getUserDepartmentByUserId,
    banUserByUserId,
    unbanUserByUserId,
    assignAdminByUserId,
    dischargeAdminByUserId,
    findOneUser
  };
}

module.exports = userMethodsFactory;
