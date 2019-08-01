const { cleanJourneysThereAndBack } = require("./clean");
const {
  getAvailableJourneysThereAndBack
} = require("./filter");
const getAllJourneysThereAndBack = require("./refresh");

const { getRoundTrips } = require("./roundTrips");

const getCheapestRoundTripPrice = async (
  weekendsAhead,
  region
) => {
  const allJourneysThereAndBack = await getAllJourneysThereAndBack(
    region,
    weekendsAhead
  );

  const availableJourneysThereAndBack = await getAvailableJourneysThereAndBack(
    allJourneysThereAndBack
  );

  const cleanedJourneys = cleanJourneysThereAndBack(
    availableJourneysThereAndBack
  );

  const roundTrips = getRoundTrips(cleanedJourneys);

  return roundTrips;
};

module.exports = getCheapestRoundTripPrice;
