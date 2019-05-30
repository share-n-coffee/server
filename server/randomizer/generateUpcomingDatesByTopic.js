// takes event returns dates for next month since last generating
function generateUpcomingDatesByTopic({
  weekDay,
  time,
  created,
  lastEventsCreationDate
}) {
  const nextDates = [];
  let firstDayNextMonth = new Date();
  if (lastEventsCreationDate === undefined) {
    firstDayNextMonth = new Date(
      new Date(created).getFullYear(),
      new Date(created).getMonth() + 1,
      1,
      3
    );
  } else {
    firstDayNextMonth = new Date(
      new Date(lastEventsCreationDate).getFullYear(),
      new Date(lastEventsCreationDate).getMonth() + 2,
      1,
      3
    );
  }

  const endOfMonth = new Date(
    firstDayNextMonth.getFullYear(),
    firstDayNextMonth.getMonth() + 1,
    1,
    2,
    59,
    59
  );

  const oneDay = 60 * 60 * 24 * 1000;

  const findDates = timestamp => {
    let currentTime = timestamp;
    const eventTime = time;
    if (currentTime > endOfMonth) {
      return nextDates;
    }
    const currentDay = new Date(currentTime).getDay();
    if (currentDay === weekDay) {
      const year = new Date(currentTime).getFullYear();
      const month = new Date(currentTime).getMonth();
      const day = new Date(currentTime).getDate();
      const hour = eventTime.slice(0, eventTime.indexOf(':'));
      const minutes = eventTime.slice(eventTime.indexOf(':') + 1);
      nextDates.push(new Date(year, month, day, hour, minutes));
    }
    findDates((currentTime += oneDay));
    return nextDates;
  };
  return findDates(firstDayNextMonth.getTime());
}

module.exports = generateUpcomingDatesByTopic;
