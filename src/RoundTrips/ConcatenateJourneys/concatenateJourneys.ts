import { Journey, Station } from "flix";

const concatenateSimilarJourneys = (
  journeys: Journey[],
  isGoingThere: boolean
): Journey[] => {
  const journeysById = getJourneysById(journeys);

  const concatenatedJourneys = getConcatenatedJourneys(
    journeysById,
    isGoingThere
  );

  return concatenatedJourneys;
};

const getJourneysById = (journeys: Journey[]) => {
  const journeysById = journeys.reduce<JourneysById>(
    (journeysById, journey) => {
      const journeyIdParts = journey.id.split("-");

      let directJourney;

      const journeyId = journeyIdParts[1];

      if (journeyId in journeysById) {
        const previousJourneys = journeysById[journeyId];
        directJourney = [...previousJourneys, journey];
      } else {
        directJourney = [journey];
      }

      return {
        ...journeysById,
        [journeyId]: directJourney,
      };
    },
    {}
  );

  return journeysById;
};

const getConcatenatedJourneys = (
  journeysById: JourneysById,
  isGoingThere: boolean
) => {
  const similarJourneys: Journey[][] = Object.entries(
    journeysById
  ).map(([id, journeys]) => journeys);

  const concatenatedJourneys = similarJourneys.map(
    (sameJourneysFromDifferentStations) => {
      const concatenatedJourneyInformation: ConcatenatedJourneyInformation = getConcatenatedJourneyInformation(
        sameJourneysFromDifferentStations,
        isGoingThere
      );

      const baseJourney: Journey = {
        ...sameJourneysFromDifferentStations[0],
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

interface JourneysById {
  [key: string]: Journey[];
}

export { concatenateSimilarJourneys };
