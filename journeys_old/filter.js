const moment = require("moment-timezone");

const removeJourneysWithUnavailablePriceAndTooManyStopOvers = (
  journey,
  maxLegs
) => {
  const date = moment(journey.legs[0].departure);
  return (
    journey.price.available &&
    journey.legs.length == maxLegs
  );
};

const getCheapUniqueJourneys = (
  allJourneys,
  weekday,
  maxLegs = 2
) => {
  const cheapUniqueJourneys = allJourneys
    .filter(journey =>
      removeJourneysWithUnavailablePriceAndTooManyStopOvers(
        journey,
        maxLegs
      )
    )
    .sort((a, b) => {
      return b.price.amount - a.price.amount;
    })

  return cheapUniqueJourneys;
};

const getGoodJourneysToGorlitz = async () => {
  const allJourneysToGorlitz = require("../jsons/journeysToGorlitz.json"); // await getAllJourneysToGorlitz(); //
  const uniqueJourneys = getCheapUniqueJourneys(
    allJourneysToGorlitz
  );
  return uniqueJourneys;
};

const getGoodJourneysToBerlin = async () => {
  const allJourneysToBerlin = require("../jsons/journeysToBerlin.json"); //await getAllJourneysToBerlin(); //
  const uniqueJourneys = getCheapUniqueJourneys(
    allJourneysToBerlin
  );

  return uniqueJourneys;
};

module.exports = {
  removeJourneysWithUnavailablePriceAndTooManyStopOvers,
  getCheapUniqueJourneys,
  getGoodJourneysToGorlitz,
  getGoodJourneysToBerlin
};
