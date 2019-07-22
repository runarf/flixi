import cleanJourneysThereAndBack from "./clean";
import getGoodJourneysThereAndBack from "./filter";

import getRoundTrips from "./roundTrips";

const getCheapestRoundTripPrice = async region => {
  debugger;
  const goodJourneysThereAndBack = await getGoodJourneysThereAndBack(
    region
  );
  const cleanedJourneys = cleanJourneysThereAndBack(
    goodJourneysThereAndBack
  );

  const roundTrips = getRoundTrips(cleanedJourneys);

  console.log(roundTrips.map(trip => trip.roundTripPrice));

  return getCheapestRoundTripPrice;
};

export default getCheapestRoundTripPrice;
