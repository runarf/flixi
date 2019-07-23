import cleanJourneysThereAndBack from "./clean.mjs";
import getGoodJourneysThereAndBack from "./filter.mjs";

import getRoundTrips from "./roundTrips.mjs";

const getCheapestRoundTripPrice = async (
  weekendsAhead,
  region
) => {
  const goodJourneysThereAndBack = await getGoodJourneysThereAndBack(
    weekendsAhead,
    region
  );
  const cleanedJourneys = cleanJourneysThereAndBack(
    goodJourneysThereAndBack
  );

  const roundTrips = getRoundTrips(cleanedJourneys);

  return roundTrips;
};

export default getCheapestRoundTripPrice;
