import { Journey } from "flix";
interface SameJourneysWithDifferentStopsById {
  [key: string]: Journey[];
}
export const getSameJourneysWithDifferentStops = (
  journeys: Journey[]
) => {
  const sameJourneysWithDifferentStopsById = journeys.reduce<
    SameJourneysWithDifferentStopsById
  >((sameJourneysWithDifferentStopsById, journey) => {
    const journeyIdParts = journey.id.split("-");
    const journeyId = journeyIdParts[1];
    let sameJourneys: Journey[];
    if (journeyId in sameJourneysWithDifferentStopsById) {
      const previousJourneys =
        sameJourneysWithDifferentStopsById[journeyId];
      sameJourneys = [...previousJourneys, journey];
    } else {
      sameJourneys = [journey];
    }
    return {
      ...sameJourneysWithDifferentStopsById,
      [journeyId]: sameJourneys,
    };
  }, {});
  const allSameJourneysWithDifferentStops: Journey[][] = Object.entries(
    sameJourneysWithDifferentStopsById
  ).map(
    ([_journeyId, sameJourneysWithDifferentStops]) =>
      sameJourneysWithDifferentStops
  );
  return allSameJourneysWithDifferentStops;
};
