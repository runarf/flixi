import { ThereAndBackJourneys } from "..";
import { Journey, Station } from "flix";

export interface Trip {
  departure: String;
  arrival: String;
  origin: Station[];
  destination: Station[];
  price: number;
  url: string;
  isDirect: boolean;
}

export const convertJourneyToTrip = (
  journey: Journey
): Trip => {
  const legs = journey.legs;

  const departureLeg = legs[0];
  const arrivalLeg = legs[legs.length - 1];

  //const departureOriginIsBerlin =

  const origin: Station[] = Array.isArray(
    departureLeg.origin
  )
    ? departureLeg.origin
    : [
        {
          id: departureLeg.origin.id,
          name: departureLeg.origin.name,
        },
      ];

  const destination: Station[] = Array.isArray(
    arrivalLeg.destination
  )
    ? arrivalLeg.destination
    : [
        {
          id: arrivalLeg.destination.id,
          name: arrivalLeg.destination.name,
        },
      ];

  const trip: Trip = {
    departure: departureLeg.departure,
    arrival: arrivalLeg.arrival,
    origin,
    destination,
    price: journey.price.amount,
    url: journey.price.url,
    isDirect: legs.length === 1,
  };

  return trip;
};

export const convertJourneysToTrips = (
  journeys: Journey[]
): Trip[] => {
  return journeys.map((journey) => {
    return convertJourneyToTrip(journey);
  });
};

export interface ThereAndBackTrips {
  there: Trip[];
  back: Trip[];
}

export const convertJourneysToTripsThereAndBack = (
  journeysThereAndBack: ThereAndBackJourneys
): ThereAndBackTrips => {
  return {
    there: convertJourneysToTrips(
      journeysThereAndBack.there
    ),
    back: convertJourneysToTrips(journeysThereAndBack.back),
  };
};
