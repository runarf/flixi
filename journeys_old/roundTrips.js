const moment = require("moment-timezone");

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
  const journeyThereLegs = journeyThere.legs;
  const journeyBackLegs = journeyBack.legs;
  return [
    ...roundTrips,
    {
      roundTripPrice:
        journeyThere.price.amount +
        journeyBack.price.amount,

      there: {
        origin: journeyThereLegs[0].origin.name,
        destination:
          journeyThereLegs[journeyThereLegs.length - 1]
            .destination.name,
        departure: journeyThereLegs[0].departure,
        arrival:
          journeyThereLegs[journeyThereLegs.length - 1]
            .arrival,
        price: journeyThere.price.amount,
        url: journeyThere.price.url
        //rest: journeyThere
      },
      back: {
        origin: journeyBackLegs[0].origin.name,
        destination:
          journeyBackLegs[journeyBackLegs.length - 1]
            .destination.name,
        departure: journeyBackLegs[0].departure,
        arrival:
          journeyBackLegs[journeyBackLegs.length - 1]
            .arrival,
        price: journeyBack.price.amount,
        url: journeyBack.price.url
        //rest: journeyBack
      }
    }
  ];
};

const getRoundTrips = (origin, destination) => {
  const roundTrips = origin
    .flatMap(journeyTo => {
      return destination.reduce(
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
  getRoundTrips
};
