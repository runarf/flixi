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
  const journeysById = journeys.reduce(
    (journeysById, journey) => {
      const journeyIdParts = journey.id.split("-");

      if (journeyIdParts[0] === "direct") {
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
          [journeyId]: directJourney
        };
      } else {
        return {
          ...journeysById,
          nonDirect: [...journeysById.nonDirect, journey]
        };
      }
    },
    { nonDirect: [] }
  );

  return journeysById;
};

const getConcatenatedJourneys = (
  journeysById: JourneysById,
  isGoingThere: boolean
) => {
  const temp = Object.entries(journeysById);

  const reducedTemp = temp.reduce(
    (acc, [journeyId, journeys]) => {
      if (journeyId === "nonDirect") {
        return [...acc, ...journeys];
      } else {
        return [...acc, journeys];
      }
    },
    []
  ) as Journey[][];

  const concatenatedJourneys = reducedTemp.map(journeys => {
    const concatenatedJourneyInformation = getConcatenatedJourneyInformation(
      journeys,
      isGoingThere
    );

    const concatenatedJourney: Journey = {
      ...journeys[0]
    };

    const stations = concatenatedJourneyInformation.stations.sort(
      (a, b) => a.name.localeCompare(b.name)
    );

    const journeyLegs = concatenatedJourney.legs;

    if (isGoingThere) {
      journeyLegs[0].origin = stations;
    } else {
      journeyLegs[
        journeyLegs.length - 1
      ].destination = stations;
    }

    concatenatedJourney.price.amount =
      concatenatedJourneyInformation.cheapestPrice;

    return concatenatedJourney;
  });

  const tomp = concatenatedJourneys;

  return tomp;
};

const getDirectJourney = (
  journeysById,
  journeyId: String
) => {};

const getConcatenatedJourneyInformation = (
  journeys: Journey[],
  isGoingThere: boolean
) => {
  const concatenatedJourneyInformation = journeys.reduce<{
    stations: Station[];
    cheapestPrice: number;
  }>(
    (concatenatedJourney, journey) => {
      const journeyLegs = journey.legs;
      const newStation = (isGoingThere
        ? journeyLegs[0].origin
        : journeyLegs[journeyLegs.length - 1]
            .destination) as Station;

      const stations = concatenatedJourney.stations.some(
        station =>
          station.name === newStation.name &&
          station.id === newStation.id
      )
        ? [...concatenatedJourney.stations]
        : [...concatenatedJourney.stations, newStation];

      const journeyPrice = journey.price.amount;
      const currentCheapestPrice =
        concatenatedJourney.cheapestPrice;

      const cheapestPrice =
        currentCheapestPrice === 0 ||
        journeyPrice < currentCheapestPrice
          ? journeyPrice
          : currentCheapestPrice;

      return {
        stations,
        cheapestPrice
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
