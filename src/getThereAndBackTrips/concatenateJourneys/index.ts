import { Journey, Leg, Station } from "flix";
import { ThereAndBackJourneys } from "..";
import { concatenateSimilarJourneys } from "./concatenateJourneys";

export const concatenateJourneys = (
  allJourneysThereAndBack: ThereAndBackJourneys
): ThereAndBackJourneys => {
  const there = concatenateJourneysOneWay(
    allJourneysThereAndBack.there,
    true
  );
  const back = concatenateJourneysOneWay(
    allJourneysThereAndBack.back,
    false
  );

  return {
    there,
    back,
  };
};

const concatenateJourneysOneWay = (
  allJourneys: Journey[],
  isGoingThere: boolean,
  maxLegs = 2
): Journey[] => {
  const availableJourneys = allJourneys
    .filter((journey) =>
      removeJourneysUnavailableAndTooManyStopOvers(
        journey,
        maxLegs
      )
    )
    .sort((a, b) => {
      return b.price.amount - a.price.amount;
    });

  const concatenatedJourneys: Journey[] = concatenateSimilarJourneys(
    availableJourneys,
    isGoingThere
  );

  return concatenatedJourneys;
};

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
