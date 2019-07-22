import cleanJourneysThereAndBack from "./clean.mjs";
import getGoodJourneysThereAndBack from "./filter.mjs";

import getRoundTrips from "./roundTrips.mjs";

const getCheapestRoundTripPrice = async region => {
  const goodJourneysThereAndBack = await getGoodJourneysThereAndBack(
    region
  );
  const cleanedJourneys = cleanJourneysThereAndBack(
    goodJourneysThereAndBack
  );

  const roundTrips = getRoundTrips(cleanedJourneys);

  console.log(roundTrips.map(trip => trip.roundTripPrice));

  return roundTrips;
};

export default getCheapestRoundTripPrice;
