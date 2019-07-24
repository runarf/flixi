const moment = require("moment-timezone");

const getDatesIn = (now, day, inWeeksFromNow) => {
  const lengthOfArray = inWeeksFromNow * 7 + 1;
  const days = [...Array(lengthOfArray).keys()].reduce(
    (dates, dayIndex) => {
      const date = now
        .clone()
        .startOf("day")
        .add(dayIndex, "days")
        .startOf("day");

      if (date.isoWeekday() === day) {
        return [...dates, date];
      } else {
        return dates;
      }
    },
    []
  );
  return days;
};

const getEveryFridaysFromNowTo = weeks => {
  const fridays = getDatesIn(
    moment.tz("Europe/Berlin"),
    5,
    weeks
  );

  return fridays;
};

const getEverySundaysFromNowTo = weeks => {
  return getDatesIn(moment.tz("Europe/Berlin"), 7, weeks);
};

module.exports = {
  getDatesIn,
  getEveryFridaysFromNowTo,
  getEverySundaysFromNowTo
};
