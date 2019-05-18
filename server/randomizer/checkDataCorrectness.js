const checkDBMapping = require('./checkDBMapping');
const checkUserFields = require('./checkUserFields');

function checkData(allData) {
  const eventsData = allData[0];
  const departmentsData = allData[1];
  let usersData = allData[2];

  usersData = checkUserFields(usersData); // проверяем наличие отдела и запланированных событий
  checkDBMapping(eventsData, departmentsData, usersData); // проверяем, что id отдела и событий у юзера соответствуют базе данных
}
module.exports = checkData;
