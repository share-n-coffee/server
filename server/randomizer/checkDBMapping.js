function checkDBMapping(eventsData, departmentsData, usersData) {
  const eventsIds = [];
  const departmentsIds = [];

  eventsData.forEach(event => {
    eventsIds.push(event.id);
  });

  departmentsData.forEach(department => {
    departmentsIds.push(department.id);
  });

  usersData.forEach(user => {
    user.events.forEach(userEventId => {
      const eventIdMatches = eventsIds.find(eventId => {
        return eventId === userEventId;
      });

      if (!eventIdMatches)
        throw Error(
          `User event Id ${userEventId} does not match to any arranged event Id`
        );
    });

    const departmentIdMatches = departmentsIds.find(departmentId => {
      return departmentId === user.department.toString();
    });

    if (!departmentIdMatches)
      throw Error(
        `User department Id ${
          user.department
        } does not match to any registered department Id`
      );
  });
}
module.exports = checkDBMapping;
