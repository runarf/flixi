import getAllJourneysThereAndBack from "./refresh";

const removeJourneysWithUnavailablePriceAndTooManyStopOvers = (
  journey,
  maxLegs
) => {
  return (
    journey.price.available &&
    journey.legs.length === maxLegs
  );
};

const getCheapUniqueJourneys = (
  allJourneys,
  maxLegs = 2
) => {
  const cheapUniqueJourneys = allJourneys
    .filter(journey =>
      removeJourneysWithUnavailablePriceAndTooManyStopOvers(
        journey,
        maxLegs
      )
    )
    .sort((a, b) => {
      return b.price.amount - a.price.amount;
    });

  return cheapUniqueJourneys;
};

const getUniqueJourneysThereAndBack = allJourneysThereAndBack => {
  return {
    there: getCheapUniqueJourneys(
      allJourneysThereAndBack.there
    ),
    back: getCheapUniqueJourneys(
      allJourneysThereAndBack.back
    )
  };
};

const getGoodJourneysThereAndBack = async region => {
  const allJourneysThereAndBack = await getAllJourneysThereAndBack(
    region,
    1
  );
  const uniqueJourneysThereAndBack = getUniqueJourneysThereAndBack(
    allJourneysThereAndBack
  );

  return uniqueJourneysThereAndBack;
};

export default getGoodJourneysThereAndBack;
