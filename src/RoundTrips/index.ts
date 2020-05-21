import { convertJourneysToTripsThereAndBack } from "./ConvertJourneysToTrips";
import { ThereAndBackTrips } from "../TripInterfaces";
import { concatenateJourneys } from "./ConcatenateJourneys";
import { getAllJourneysThereAndBack } from "./RefreshJourneys";
import { Journey, Station } from "flix";

export interface ThereAndBackJourneys {
  there: Journey[];
  back: Journey[];
}

const getThereAndBackTrips = async (
  weekendsAhead: number,
  region: Station
): Promise<ThereAndBackTrips> => {
  const allJourneysThereAndBack: ThereAndBackJourneys = await getAllJourneysThereAndBack(
    region,
    weekendsAhead
  );

  const concatenatedJourneys: ThereAndBackJourneys = concatenateJourneys(
    allJourneysThereAndBack
  );

  const thereAndBackTrips: ThereAndBackTrips = convertJourneysToTripsThereAndBack(
    concatenatedJourneys
  );

  return thereAndBackTrips;
};

export { getThereAndBackTrips };
