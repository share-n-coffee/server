/* eslint-disable prettier/prettier */
// Функция принимает объект event и генерирует события на следущий месяц и заносит их в event.options.nexDates
function generateUpcomingEvents({ options, created }) {
  // 00:00:00 первого числа следующего месяца
  const firstDayNextMonth = new Date(
    new Date(created).getFullYear(),
    new Date(created).getMonth() + 1,
    1,
    3
  );
  // 23:59:59 последнего числа месяца
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
    if (timestamp > endOfMonth) {
      return options.nextDates;
    }
    const currentDay = new Date(currentTime).getDay();
    if (currentDay === options.regularity) {
      const year = new Date(currentTime).getFullYear();
      const month = new Date(currentTime).getMonth();
      const day = new Date(currentTime).getDate();
      const hour = options.hour + 3;
      options.nextDates.push(new Date(year, month, day, hour));
      if (!options.cyclic) {
        return options.nextDates;
      }
    }
    findDates((currentTime += oneDay));
    return options.nextDates;
  };

  findDates(firstDayNextMonth.getTime());
}

module.exports = generateUpcomingEvents;
