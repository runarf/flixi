import {
  cleanJourneysThereAndBack,
  CleanThereAndBack
} from "./CleanJourneys";
import { getAvailableJourneysThereAndBack } from "./ConcatenateJourneys";
import { getAllJourneysThereAndBack } from "./RefreshJourneys";
import { Journey, Station } from "flix";

export interface ThereAndBack {
  there: Journey[];
  back: Journey[];
}

const getCheapestRoundTripPrice = async (
  weekendsAhead: number,
  region: Station
): Promise<CleanThereAndBack> => {
  const allJourneysThereAndBack: ThereAndBack = await getAllJourneysThereAndBack(
    region,
    weekendsAhead
  );

  const availableJourneysThereAndBack: ThereAndBack = await getAvailableJourneysThereAndBack(
    allJourneysThereAndBack
  );

  const cleanedJourneys: CleanThereAndBack = cleanJourneysThereAndBack(
    availableJourneysThereAndBack
  );

  return cleanedJourneys;
};

export { getCheapestRoundTripPrice };
