import { cleanJourneysThereAndBack } from "./clean/";
import { getAvailableJourneysThereAndBack } from "./filter/";
import { getAllJourneysThereAndBack } from "./refresh/";

const getCheapestRoundTripPrice1 = async (
  weekendsAhead: number,
  region: string
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

  return cleanedJourneys;
};

export { getCheapestRoundTripPrice1 };
