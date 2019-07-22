const { cleanJourneys } = require("./clean");
const helper = require("../helper");
const {
  getGoodJourneysToBerlin,
  getGoodJourneysToGorlitz
} = require("./filter");

const { getRoundTrips } = require("./roundTrips");

const getCheapestRoundTripPrice = async () => {
  const cheapestJourneysToBerlin = cleanJourneys(
    await getGoodJourneysToBerlin()
  );
  const cheapestJourneysToGorlitz = cleanJourneys(
    await getGoodJourneysToGorlitz()
  );

  const roundTrips = getRoundTrips(
    cheapestJourneysToGorlitz,
    cheapestJourneysToBerlin
  );

  helper.writeJsonToFile(roundTrips, "roundTripPrices");

  console.log(roundTrips.map(trip => trip.roundTripPrice));
};

getCheapestRoundTripPrice();

module.exports = {
  getCheapestRoundTripPrice
};
