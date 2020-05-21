import { Journey, Leg } from "flix";
import { getSameJourneysWithDifferentStops } from "./getSameJourneysWithDifferentStops";
import {
  JourneyStationsAndCheapestPrice,
  getJourneyStationsAndCheapestPrice,
} from "./getJourneyStationsAndCheapestPrice";

export const concatenateSimilarJourneys = (
  journeys: Journey[],
  isGoingThere: boolean
): Journey[] => {
  const sameJourneysWithDifferentStopsById = getSameJourneysWithDifferentStops(
    journeys
  );

  const concatenatedJourneys = getConcatenatedJourneys(
    sameJourneysWithDifferentStopsById,
    isGoingThere
  );

  return concatenatedJourneys;
};

const getConcatenatedJourneys = (
  sameJourneysWithDifferentStops: Journey[][],
  isGoingThere: boolean
) => {
  const concatenatedJourneys = sameJourneysWithDifferentStops.map(
    (sameJourneyFromDifferentStations) => {
      const journeyStationsAndCheapestPrice: JourneyStationsAndCheapestPrice = getJourneyStationsAndCheapestPrice(
        sameJourneyFromDifferentStations,
        isGoingThere
      );

      const baseJourney: Journey = {
        ...sameJourneyFromDifferentStations[0],
      };

      const stations = journeyStationsAndCheapestPrice.stations.sort(
        (a, b) => a.name.localeCompare(b.name)
      );

      const journeyLegs: Leg[] = baseJourney.legs;

      if (isGoingThere) {
        journeyLegs[0].origin = stations;
      } else {
        journeyLegs[
          journeyLegs.length - 1
        ].destination = stations;
      }

      baseJourney.legs = journeyLegs;
      baseJourney.price.amount =
        journeyStationsAndCheapestPrice.cheapestPrice;

      return baseJourney;
    }
  );
  return concatenatedJourneys;
};
