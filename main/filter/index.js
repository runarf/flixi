const writeFileToJson = require("../../misc/helper");

const removeJourneysUnavailableAndTooManyStopOvers = (
  journey,
  maxLegs
) => {
  return (
    journey.status !== "full" &&
    journey.price.available &&
    journey.legs.length <= maxLegs
  );
};

const getJourneysById = journeys => {
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
  journeys,
  isGoingThere
) => {
  const concatenatedJourneyInformation = journeys.reduce(
    (concatenatedJourney, journey) => {
      const journeyLegs = journey.legs;
      const { name, id } = isGoingThere
        ? journeyLegs[0].origin
        : journeyLegs[journeyLegs.length - 1].destination;

      const newStation = { name, id };
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

const getConcatenatedJourneys = (
  journeysById,
  isGoingThere
) => {
  const concatenatedJourneys = Object.entries(
    journeysById
  ).map(([journeyId, journeys]) => {
    if (journeyId === "nonDirect") {
      return journeys;
    }
    const concatenatedJourneyInformation = getConcatenatedJourneyInformation(
      journeys,
      isGoingThere
    );

    const concatenatedJourney = { ...journeys[0] };

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

  return concatenatedJourneys.flat();
};

const concatenateSimilarJourneys = (
  journeys,
  isGoingThere
) => {
  const journeysById = getJourneysById(journeys);

  const concatenatedJourneys = getConcatenatedJourneys(
    journeysById,
    isGoingThere
  );

  return concatenatedJourneys;
};

const getUniqueAvailableJourneys = (
  allJourneys,
  isGoingThere,
  maxLegs = 2
) => {
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
  const uniqueJourneysThereAndBack = {
    there: getUniqueAvailableJourneys(
      allJourneysThereAndBack.there,
      true
    ),
    back: getUniqueAvailableJourneys(
      allJourneysThereAndBack.back,
      false
    )
  };

  return uniqueJourneysThereAndBack;
};

// const journeysToPrague = require("../../jsons/journeysToPrague.json");

// const concatenatedJourneys = getUniqueAvailableJourneys(
//   journeysToPrague,
//   true
// );
// writeFileToJson(concatenatedJourneys, "concatJourneys");

module.exports = { getAvailableJourneysThereAndBack };
