const moment = require("moment-timezone");
const writeToJson = require("../../helper/index.js");

const getRoundTripsOverWeekend = (
  roundTrips,
  journeyThere,
  journeyBack
) => {
  const departureTo = moment(journeyThere.departure);
  const arrivalBack = moment(journeyBack.arrival);

  const daysBetween = arrivalBack.diff(departureTo, "days");

  if (daysBetween > 4 || daysBetween < 0) {
    return roundTrips;
  }

  const roundTrip = {
    price: journeyThere.price + journeyBack.price,

    there: journeyThere,
    back: journeyBack
  };
  return [...roundTrips, roundTrip];
};

const getRoundTrips = ({ there, back }) => {
  const roundTrips = there
    .flatMap(journeyTo => {
      return back.reduce(
        (roundTrips, journeyBack) =>
          getRoundTripsOverWeekend(
            roundTrips,
            journeyTo,
            journeyBack
          ),
        []
      );
    })
    .sort((a, b) => b.roundTripPrice - a.roundTripPrice);

  return roundTrips;
};

module.exports = {
  getRoundTrips,
  getRoundTripsOverWeekend
};
