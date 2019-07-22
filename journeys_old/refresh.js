const flix = require("flix");
const dates = require("../dates");
const gorlitzRegion = { type: "region", id: "3408" };
const berlinRegion = { type: "region", id: "88" };
const helper = require("../helper");

const refreshJourneys = async () => {
  const allJourneysToGorlitz = await getAllJourneysToGorlitz(
    2
  );
  helper.writeJsonToFile(
    allJourneysToGorlitz,
    "journeysToGorlitz"
  );

  const allJourneysToBerlin = await getAllJourneysToBerlin(
    2
  );
  helper.writeJsonToFile(
    allJourneysToBerlin,
    "journeysToBerlin"
  );
};

const getAllJourneysToBerlin = async weekends => {
  const sundays = dates.getSundaysIn(weekends);
  const journeys = await getJourneys(
    gorlitzRegion,
    berlinRegion,
    sundays
  );
  return journeys;
};
const getAllJourneysToGorlitz = async weekends => {
  const fridays = dates.getFridaysIn(weekends);
  const journeys = await getJourneys(
    berlinRegion,
    gorlitzRegion,
    fridays
  );
  return journeys;
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

refreshJourneys();
module.exports = {
  refreshJourneys
};
