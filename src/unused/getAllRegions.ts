import {
  journeys as flixJourneys,
  Station,
  regions as flixRegions,
} from "flix";
import { writeJsonToFile } from "./misc/helper";
const berlinRegion: Station = { type: "region", id: "88" };
const gorlitzRegion: Station = {
  type: "region",
  id: "3408",
};

console.log("hi");

const journeysToGorlitz = async () => {
  const journeys = await flixJourneys(
    berlinRegion,
    gorlitzRegion
  );
  writeJsonToFile(journeys, "journeysToGorlitz");
};

const getAllRegions = () => {
  const regionStream = flixRegions.all();
  const regions = [];
  regionStream.on("data", (region) => {
    regions.push(region);
  });

  regionStream.on("end", () => {
    writeJsonToFile(regions, "allRegions");
  });
};

journeysToGorlitz();
