import { convertJourneysToTripsThereAndBack } from "./ConvertJourneysToTrips";
import { ThereAndBackTrips } from "../TripInterfaces";
import { getAvailableJourneysThereAndBack } from "./ConcatenateJourneys";
import { getAllJourneysThereAndBack } from "./RefreshJourneys";
import { Journey, Station } from "flix";

export interface ThereAndBackJourneys {
  there: Journey[];
  back: Journey[];
}

const getCheapestRoundTripPrice = async (
  weekendsAhead: number,
  region: Station
): Promise<ThereAndBackTrips> => {
  const allJourneysThereAndBack: ThereAndBackJourneys = await getAllJourneysThereAndBack(
    region,
    weekendsAhead
  );

  const availableJourneysThereAndBack: ThereAndBackJourneys = await getAvailableJourneysThereAndBack(
    allJourneysThereAndBack
  );

  const cleanedJourneys: ThereAndBackTrips = convertJourneysToTripsThereAndBack(
    availableJourneysThereAndBack
  );

  return cleanedJourneys;
};

export { getCheapestRoundTripPrice };
