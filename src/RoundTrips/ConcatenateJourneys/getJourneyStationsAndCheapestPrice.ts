import { Journey, Station } from "flix";

export const getJourneyStationsAndCheapestPrice = (
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
export interface JourneyStationsAndCheapestPrice {
  stations: Station[];
  cheapestPrice: number;
}
