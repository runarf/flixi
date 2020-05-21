import { Journey, Station } from "flix";

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

const getSameJourneysWithDifferentStops = (
  journeys: Journey[]
) => {
  const sameJourneysWithDifferentStopsById = journeys.reduce<
    SameJourneysWithDifferentStopsById
  >((sameJourneysWithDifferentStopsById, journey) => {
    const journeyIdParts = journey.id.split("-");
    const journeyId = journeyIdParts[1];

    let sameJourneys: Journey[];

    if (journeyId in sameJourneysWithDifferentStopsById) {
      const previousJourneys =
        sameJourneysWithDifferentStopsById[journeyId];
      sameJourneys = [...previousJourneys, journey];
    } else {
      sameJourneys = [journey];
    }

    return {
      ...sameJourneysWithDifferentStopsById,
      [journeyId]: sameJourneys,
    };
  }, {});

  const allSameJourneysWithDifferentStops: Journey[][] = Object.entries(
    sameJourneysWithDifferentStopsById
  ).map(
    ([_journeyId, sameJourneysWithDifferentStops]) =>
      sameJourneysWithDifferentStops
  );

  return allSameJourneysWithDifferentStops;
};

const getConcatenatedJourneys = (
  sameJourneysWithDifferentStops: Journey[][],
  isGoingThere: boolean
) => {
  const concatenatedJourneys = sameJourneysWithDifferentStops.map(
    (sameJourneyFromDifferentStations) => {
      const concatenatedJourneyInformation: ConcatenatedJourneyInformation = getConcatenatedJourneyInformation(
        sameJourneyFromDifferentStations,
        isGoingThere
      );

      const baseJourney: Journey = {
        ...sameJourneyFromDifferentStations[0],
      };

      const stations = concatenatedJourneyInformation.stations.sort(
        (a, b) => a.name.localeCompare(b.name)
      );

      const journeyLegs = baseJourney.legs;

      if (isGoingThere) {
        journeyLegs[0].origin = stations;
      } else {
        journeyLegs[
          journeyLegs.length - 1
        ].destination = stations;
      }

      baseJourney.price.amount =
        concatenatedJourneyInformation.cheapestPrice;

      return baseJourney;
    }
  );
  return concatenatedJourneys;
};

interface ConcatenatedJourneyInformation {
  stations: Station[];
  cheapestPrice: number;
}

const getConcatenatedJourneyInformation = (
  sameJourneysFromDifferentStations: Journey[],
  isGoingThere: boolean
) => {
  const concatenatedJourneyInformation = sameJourneysFromDifferentStations.reduce<
    ConcatenatedJourneyInformation
  >(
    (concatenatedJourney, currentJourney) => {
      const journeyLegs = currentJourney.legs;
      const currentJourneyStation: Station = (isGoingThere
        ? journeyLegs[0].origin
        : journeyLegs[journeyLegs.length - 1]
            .destination) as Station;

      const stationIsAlreadyInListOfStations = concatenatedJourney.stations.some(
        (station) =>
          station.name === currentJourneyStation.name &&
          station.id === currentJourneyStation.id
      );

      const stationsForJourney = stationIsAlreadyInListOfStations
        ? [...concatenatedJourney.stations]
        : [
            ...concatenatedJourney.stations,
            currentJourneyStation,
          ];

      const journeyPrice = currentJourney.price.amount;

      const currentCheapestPrice =
        concatenatedJourney.cheapestPrice;

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

  return concatenatedJourneyInformation;
};

interface SameJourneysWithDifferentStopsById {
  [key: string]: Journey[];
}
