import { Journey, Leg, Station } from "flix";
import { ThereAndBack } from "..";

const removeJourneysUnavailableAndTooManyStopOvers = (
  journey: Journey,
  maxLegs: number
) => {
  return (
    journey.status !== "full" &&
    journey.price.available &&
    journey.legs.length <= maxLegs
  );
};

const getJourneysById = (journeys: Journey[]) => {
  const journeysById = journeys.reduce(
    (journeysById, journey) => {
      const journeyIdParts = journey.id.split("-");

      if (journeyIdParts[0] === "direct") {
        const journeyId = journeyIdParts[1];
        if (journeyId in journeysById) {
          const previousJourneys = journeysById[journeyId];
          return {
            ...journeysById,
            [journeyId]: [...previousJourneys, journey]
          };
        } else {
          return {
            ...journeysById,
            [journeyId]: [journey]
          };
        }
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

const getUniqueAvailableJourneys = (
  allJourneys: Journey[],
  isGoingThere: boolean,
  maxLegs = 2
): Journey[] => {
  const availableJourneys = allJourneys
    .filter(journey =>
      removeJourneysUnavailableAndTooManyStopOvers(
        journey,
        maxLegs
      )
    )
    .sort((a, b) => {
      return b.price.amount - a.price.amount;
    });

  const concatenatedJourneys = concatenateSimilarJourneys(
    availableJourneys,
    isGoingThere
  );

  return concatenatedJourneys;
};

const getAvailableJourneysThereAndBack = async allJourneysThereAndBack => {
  const there = getUniqueAvailableJourneys(
    allJourneysThereAndBack.there,
    true
  );
  const back = getUniqueAvailableJourneys(
    allJourneysThereAndBack.back,
    false
  );

  const uniqueJourneysThereAndBack: ThereAndBack = {
    there,
    back
  };

  return uniqueJourneysThereAndBack;
};

export { getAvailableJourneysThereAndBack };
