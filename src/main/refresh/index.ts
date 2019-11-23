import * as flix from "flix";
import * as dates from "../dates";
import { Moment } from "moment-timezone";

const berlinRegion = { type: "region", id: "88" };

const getAllJourneysThereAndBack = async (
  region,
  weekends
) => {
  const fridays = dates.getEveryFridaysFromNowTo(weekends);
  const sundays = dates.getEverySundaysFromNowTo(weekends);

  const journeysThere = await getJourneys(
    berlinRegion,
    region,
    fridays
  );

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

const getJourneys = async (
  origin,
  destination,
  dates: Moment[]
): Promise<flix.Journey[]> => {
  let journeysPromises: Promise<flix.Journey[]>[];
  try {
    journeysPromises = dates.map(date => {
      const journeyPromise: Promise<flix.Journey[]> = flix.journeys(
        origin,
        destination,
        {
          when: date.toDate(),
          interval: 48 * 60,
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
export { getAllJourneysThereAndBack };
