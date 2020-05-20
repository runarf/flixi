import * as moment from "moment-timezone";

const getDatesIn = (now, day, inWeeksFromNow) => {
  const lengthOfArray = inWeeksFromNow * 7;
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

export const getEveryFridaysFromNowTo = (weeks) => {
  const fridays = getDatesIn(
    moment.tz("Europe/Berlin"),
    5,
    weeks
  );

  return fridays;
};

export const getEverySundaysFromNowTo = (weeks) => {
  return getDatesIn(moment.tz("Europe/Berlin"), 7, weeks);
};
