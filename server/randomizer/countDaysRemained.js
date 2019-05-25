function countDaysRemained(eventDate) {
  const currentDate = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  const daysRemained = Math.floor((eventDate - currentDate) / oneDay);
  return daysRemained;
}

module.exports = countDaysRemained;
