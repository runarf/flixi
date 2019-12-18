import { Journey, Leg, Station } from "flix";
import { ThereAndBack } from "..";
import { concatenateSimilarJourneys } from "./concatenateJourneys";

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
