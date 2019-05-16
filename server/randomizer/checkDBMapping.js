function checkDBMapping(eventsData, departmentsData, usersData) {
  const eventsIds = eventsData.map(event => event.id);
  const departmentsIds = departmentsData.map(department => department.id);

  usersData.forEach(user => {
    user.events.forEach(userEventObj => {
      const eventIdMatches = eventsIds.find(eventId => {
        return eventId === userEventObj.eventId.toString();
      });

      if (!eventIdMatches)
        throw Error(
          `User event Id ${
            userEventObj.eventId
          } does not match to any arranged event Id`
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
