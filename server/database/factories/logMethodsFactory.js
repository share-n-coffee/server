const LogSchema = require('../models/log');
const isNull = require('../../utilities/isNull');

function logMethodsFactory(logModelName) {
  if (isNull(logModelName)) {
    return {};
  }

  const Logs = LogSchema(logModelName);

  // const getAllUsers = (fields = null) => {
  //   return Users.find({}, fields).exec();
  // };

  // const querySearch = (query, fields = null) => {
  //   return Users.find(query, fields).exec();
  // };

  // const getUserById = (id, fields = null) => {
  //   return Users.findOne({ _id: id }, fields).exec();
  // };

  // const getUserByTelegramUserId = (telegramUserId, fields = null) => {
  //   return Users.findOne({ telegramUserId }, fields).exec();
  // };

  // const postNewUser = user => {
  //   const newUser = new Users(user);

  //   return new Promise((resolve, reject) => {
  //     newUser.save((err, addedUser) => {
  //       if (err) reject(err);
  //       resolve(addedUser);
  //     });
  //   });
  // };

  // const getAllUsersByEventId = id => {
  //   return Users.find({ 'events.eventId': id }).exec();
  // };

  // const putUserBan = (user, banned) => {
  //   return Users.findOneAndUpdate(
  //     user,
  //     { $set: { banned } },
  //     { useFindAndModify: false, new: true },
  //     (err, data) => data
  //   );
  // };

  // const saveNewUser = user => {
  //   return new Promise((resolve, reject) => {
  //     const newUser = new Users({
  //       lastName: user.last_name,
  //       firstName: user.first_name,
  //       telegramUserId: user.id,
  //       avatar: user.photo_url,
  //       username: user.username
  //     });

  //     newUser.save((err, addedUser) => {
  //       if (err) reject(err);
  //       resolve(addedUser);
  //     });
  //   });
  // };

  // const updateUser = (userId, newProps) => {
  //   return Users.findOneAndUpdate(
  //     { _id: userId },
  //     { $set: newProps },
  //     { useFindAndModify: false, new: true },
  //     (err, data) => data
  //   );
  // };

  // const updateUsersEvents = (userId, eventId, operation) => {
  //   return new Promise((resolve, reject) => {
  //     Users.findById(userId, (err, findedUser) => {
  //       if (err) reject(err);

  //       const user = findedUser;
  //       const containEvent = user.events.some(
  //         event => event.eventId.toString() === eventId
  //       );

  //       if (operation === 'add' && !containEvent) {
  //         user.events.push({
  //           status: 'free',
  //           eventId
  //         });
  //       } else {
  //         user.events = user.events.filter(
  //           event => event.eventId.toString() !== eventId
  //         );
  //       }

  //       user.save((saveErr, updatedUser) => {
  //         if (saveErr) reject(saveErr);
  //         resolve(updatedUser);
  //       });
  //     });
  //   });
  // };

  // const setEventStatus = users => {
  //   const telegramUserIds = [];
  //   const userEventIds = [];
  //   const userEventStatuses = [];
  //   users.forEach(user => {
  //     telegramUserIds.push(Object.keys(user)[0]);
  //     const userEvents = Object.values(user)[0];
  //     userEventIds.push(Object.keys(userEvents)[0]);
  //     userEventStatuses.push(Object.values(userEvents)[0]);
  //   });

  //   const usersToSetStatus = users.map((user, i) => {
  //     return Users.updateOne(
  //       {
  //         telegramUserId: telegramUserIds[i],
  //         events: {
  //           $elemMatch: {
  //             eventId: `${userEventIds[i]}`
  //           }
  //         }
  //       },
  //       {
  //         $set: {
  //           'events.$.status': `${userEventStatuses[i]}`
  //         }
  //       }
  //     ).exec();
  //   });
  //   return Promise.all(usersToSetStatus);
  // };

  return {};
}

module.exports = logMethodsFactory;
