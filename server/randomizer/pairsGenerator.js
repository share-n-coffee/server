function pairsGenerator(allData) {
  const eventsData = allData[0];
  const departmentsData = allData[1];
  const usersData = allData[2];
  const events = {};
  const usersParticipation = {};

  function generateEvents() {
    eventsData.forEach(event => {
      events[event.id] = {};
    });

    usersData.forEach(user => {
      user.events.forEach(userEvent => {
        console.log(userEvent);
        if (events[userEvent][user.department]) {
          events[userEvent][user.department].push(user.username);
        } else {
          events[userEvent][user.department] = [user.username];
        }
      });
    });
    console.log(events);
  }

  generateEvents();

  function generateUsersParticipation(timesPerPeriod = 1) {
    usersData.forEach(user => {
      usersParticipation[user.id] = {
        username: user.username,
        visitesRemain: timesPerPeriod
      };
    });

    console.log(usersParticipation);
  }

  generateUsersParticipation();
}

module.exports = pairsGenerator;
