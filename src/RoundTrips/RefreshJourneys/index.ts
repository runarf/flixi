import {
  Station,
  Journey,
  journeys as flixJourneys
} from "flix";
import * as dates from "./CalculateDays";
import { Moment } from "moment-timezone";

const berlinRegion: Station = { type: "region", id: "88" };

const getAllJourneysThereAndBack = async (
  region: Station,
  weekends: number
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
  origin: Station,
  destination: Station,
  dates: Moment[]
): Promise<Journey[]> => {
  let journeysPromises: Promise<Journey[]>[];
  try {
    journeysPromises = dates.map(date => {
      const journeyPromise: Promise<Journey[]> = flixJourneys(
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
