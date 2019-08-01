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

const getAvailableJourneys = (allJourneys, maxLegs = 2) => {
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

  return availableJourneys;
};

const getAvailableJourneysThereAndBack = async allJourneysThereAndBack => {
  const uniqueJourneysThereAndBack = {
    there: getAvailableJourneys(
      allJourneysThereAndBack.there
    ),
    back: getAvailableJourneys(allJourneysThereAndBack.back)
  };

  return uniqueJourneysThereAndBack;
};

module.exports = { getAvailableJourneysThereAndBack };
