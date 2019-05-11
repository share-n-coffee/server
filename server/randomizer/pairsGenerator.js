function pairsGenerator(allData) {
  const eventsData = allData[0];
  const departmentsData = allData[1];
  const usersData = allData[2];

  const events = {};
  eventsData.forEach(event => {
    events[event.id] = {};
  });

  usersData.forEach(user => {
    user.events.forEach(userEvent => {
      if (events[userEvent][user.department]) {
        events[userEvent][user.department].push(user.telegram_user_id);
      } else {
        events[userEvent][user.department] = [user.telegram_user_id];
      }
    });
  });

  console.log(events);
}

module.exports = pairsGenerator;
