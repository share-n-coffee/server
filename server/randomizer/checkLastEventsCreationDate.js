function checkLastEventsCreationDate(lastDate) {
  const currentDate = new Date();

  const firstDayPreviousMonth = new Date(
    new Date(currentDate).getFullYear(),
    new Date(currentDate).getMonth() - 1,
    1,
    2
  );

  const lastDayPreviousMonth = new Date(
    firstDayPreviousMonth.getFullYear(),
    firstDayPreviousMonth.getMonth() + 1,
    1,
    1,
    59,
    59
  );

  if (lastDate > firstDayPreviousMonth && lastDate < lastDayPreviousMonth) {
    return true;
  }
  return false;
}

module.exports = checkLastEventsCreationDate;
