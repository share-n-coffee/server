const DBController = require('../database/dbController');

const controller = new DBController();

async function checkUserFields(userId) {
  const user = await controller.getUserByUserId(userId);
  if (user.department === undefined || user.banned.status === true) {
    return false;
  }
  return true;
}

module.exports = checkUserFields;
