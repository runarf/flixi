import { ThereAndBack } from "..";
import { Journey, Leg, Station } from "flix";

export interface CleanJourney {
  departure: String;
  arrival: String;
  origin: Station[];
  destination: Station[];
  price: number;
  url: string;
  isDirect: boolean;
}

const cleanJourneys = (journeys: Journey[]) => {
  return journeys.map(journey => {
    const legs = journey.legs;

    const departureLeg = legs[0];
    const arrivalLeg = legs[legs.length - 1];

    const origin: Station[] = Array.isArray(
      departureLeg.origin
    )
      ? departureLeg.origin
      : [
          {
            id: departureLeg.origin.id,
            name: departureLeg.origin.name
          }
        ];

    const destination: Station[] = Array.isArray(
      arrivalLeg.destination
    )
      ? arrivalLeg.destination
      : [
          {
            id: arrivalLeg.destination.id,
            name: arrivalLeg.destination.name
          }
        ];

    const cleanedJourney: CleanJourney = {
      departure: departureLeg.departure,
      arrival: arrivalLeg.arrival,
      origin,
      destination,
      price: journey.price.amount,
      url: journey.price.url,
      isDirect: legs.length === 1
    };

    return cleanedJourney;
  });
};

export interface CleanThereAndBack {
  there: CleanJourney[];
  back: CleanJourney[];
}

const cleanJourneysThereAndBack = (
  journeysThereAndBack: ThereAndBack
): CleanThereAndBack => {
  return {
    there: cleanJourneys(journeysThereAndBack.there),
    back: cleanJourneys(journeysThereAndBack.back)
  };
};

export { cleanJourneys, cleanJourneysThereAndBack };
