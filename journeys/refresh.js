const flix = require("flix");
const dates = require("./dates/index.js");

const berlinRegion = { type: "region", id: "88" };

const getAllJourneysThereAndBack = async (
  region,
  weekends
) => {
  const fridays = dates.getEveryFridaysFromNowTo(weekends);
  const journeysThere = await getJourneys(
    berlinRegion,
    region,
    fridays
  );

  const sundays = dates.getEverySundaysFromNowTo(weekends);
  const journeysBack = await getJourneys(
    region,
    berlinRegion,
    sundays
  );

  return {
    there: journeysThere,
    back: journeysBack
  };
};

const getJourneys = async (origin, destination, dates) => {
  let journeysPromises = {};
  try {
    journeysPromises = dates.map(date => {
      const journeyPromise = flix.journeys(
        origin,
        destination,
        {
          when: date.toDate(),
          interval: 24 * 60,
          transfers: 2
        }
      );
      return journeyPromise;
    });
  } catch (err) {
    console.log(err);
  }
  const journeys = await Promise.all(journeysPromises);
  return journeys.flat();
};
module.exports = getAllJourneysThereAndBack;
