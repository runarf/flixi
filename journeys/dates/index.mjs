import moment from "moment-timezone";

const getDatesIn = (day, inWeeksFromNow) => {
  const lengthOfArray = inWeeksFromNow * 7 + 1;
  const tempa = Array(lengthOfArray).keys();
  const days = [...tempa].reduce((dates, dayIndex) => {
    const date = moment
      .tz("Europe/Berlin")
      .startOf("day")
      .add(dayIndex, "days")
      .startOf("day")
      .hour(1);
    if (date.isoWeekday() === day) {
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

export default {
  getFridaysIn: getEveryFridaysIn,
  getSundaysIn: getEverySundaysIn
};
