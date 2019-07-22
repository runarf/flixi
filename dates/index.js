const moment = require("moment-timezone");

const getDatesIn = (day, inWeeksFromNow) => {
  const days = [
    ...Array(inWeeksFromNow * 7 + 1).keys()
  ].reduce((dates, dayIndex) => {
    const date = moment
      .tz("Europe/Berlin")
      .startOf("day")
      .add(dayIndex, "days")
      .startOf("day")
      .hour(1);
    if (date.isoWeekday() == day) {
      dates.push(date);
    }
    return dates;
  }, []);
  return days;
};

const getEveryFridaysIn = weeks => {
  const fridays = getDatesIn(5, weeks);

  return fridays;
};

const getEverySundaysIn = weeks => {
  return getDatesIn(7, weeks);
};

module.exports = {
  getFridaysIn: getEveryFridaysIn,
  getSundaysIn: getEverySundaysIn
};
