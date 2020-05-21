import { Journey, Station, Leg } from "flix";

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
      const journeyStationsAndCheapestPrice: JourneyStationsAndCheapestPrice = getConcatenatedJourneyInformation(
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

const getConcatenatedJourneyInformation = (
  sameJourneysFromDifferentStations: Journey[],
  isGoingThere: boolean
) => {
  const concatenatedJourneyStationsAndCheapestPrice = sameJourneysFromDifferentStations.reduce<
    JourneyStationsAndCheapestPrice
  >(
    (concatenatedJourneyInformation, currentJourney) => {
      const { legs } = currentJourney;

      const currentJourneyStation: Station = (isGoingThere
        ? legs[0].origin
        : legs[legs.length - 1].destination) as Station;

      const stationIsAlreadyInListOfStations = concatenatedJourneyInformation.stations.some(
        (station) =>
          station.name === currentJourneyStation.name &&
          station.id === currentJourneyStation.id
      );

      const stationsForJourney = stationIsAlreadyInListOfStations
        ? [...concatenatedJourneyInformation.stations]
        : [
            ...concatenatedJourneyInformation.stations,
            currentJourneyStation,
          ];

      const journeyPrice = currentJourney.price.amount;

      const currentCheapestPrice =
        concatenatedJourneyInformation.cheapestPrice;

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

  return concatenatedJourneyStationsAndCheapestPrice;
};

interface SameJourneysWithDifferentStopsById {
  [key: string]: Journey[];
}
