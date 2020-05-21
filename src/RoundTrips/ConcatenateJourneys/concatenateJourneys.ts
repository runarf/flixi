import { Journey, Station, Leg } from "flix";
import { getSameJourneysWithDifferentStops } from "./getSameJourneysWithDifferentStops";

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

interface JourneyStationsAndCheapestPrice {
  stations: Station[];
  cheapestPrice: number;
}

const getJourneyStationsAndCheapestPrice = (
  sameJourneysFromDifferentStations: Journey[],
  isGoingThere: boolean
): JourneyStationsAndCheapestPrice => {
  const journeyStationsAndCheapestPrice = sameJourneysFromDifferentStations.reduce<
    JourneyStationsAndCheapestPrice
  >(
    (journeyStationsAndCheapestPrice, journey) => {
      const { legs } = journey;

      const currentJourneyStation: Station = (isGoingThere
        ? legs[0].origin
        : legs[legs.length - 1].destination) as Station;

      const stationIsAlreadyInListOfStations = journeyStationsAndCheapestPrice.stations.some(
        (station) =>
          station.name === currentJourneyStation.name &&
          station.id === currentJourneyStation.id
      );

      const stationsForJourney = stationIsAlreadyInListOfStations
        ? [...journeyStationsAndCheapestPrice.stations]
        : [
            ...journeyStationsAndCheapestPrice.stations,
            currentJourneyStation,
          ];

      const journeyPrice = journey.price.amount;

      const currentCheapestPrice =
        journeyStationsAndCheapestPrice.cheapestPrice;

      const currentJourneyIsTheCheapestSoFar =
        currentCheapestPrice === 0 ||
        journeyPrice < currentCheapestPrice;

      const cheapestPrice = currentJourneyIsTheCheapestSoFar
        ? journeyPrice
        : currentCheapestPrice;

      return {
        stations: stationsForJourney,
        cheapestPrice,
      };
    },
    { stations: [], cheapestPrice: 0 }
  );

  return journeyStationsAndCheapestPrice;
};
