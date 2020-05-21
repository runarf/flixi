import { getDatesIn } from ".";
import * as moment from "moment-timezone";

const MONDAY = moment("Mon-22-07-2019", "ddd-DD-MM-YYYY");

const FRIDAY = MONDAY.clone().add(4, "days");

const correctFridays = [
  FRIDAY,
  FRIDAY.clone().add(7 * 1, "days"),
  FRIDAY.clone().add(7 * 2, "days"),
  FRIDAY.clone().add(7 * 3, "days"),
];

const fridays = getDatesIn(MONDAY.clone(), 5, 4);

test("get correct fridays", () => {
  expect(fridays).toEqual(correctFridays);
});

const SUNDAY = MONDAY.clone().add(6, "days");

const correctSundays = [
  SUNDAY,
  SUNDAY.clone().add(7 * 1, "days"),
  SUNDAY.clone().add(7 * 2, "days"),
  SUNDAY.clone().add(7 * 3, "days"),
];

const sundays = getDatesIn(FRIDAY.clone(), 7, 4);

test("get correct sundays", () => {
  expect(sundays).toEqual(correctSundays);
});
