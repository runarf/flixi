import express from "express";
import cors from "cors";
import getCheapestRoundTripPrice from "./journeys/index.mjs";
// import writeJsonToFile from "./helper/index.mjs";
// import cheapestRoundTrips from "./jsons/cheapestRoundTrips.mjs";

const app = express();
app.use(cors());
const port = 4000;

app.get("/:regionId", async (req, res) => {
  try {
    console.log(`Getting round trips`);
    const cheapestRoundTrips = await getCheapestRoundTripPrice(
      {
        type: "region",
        id: req.params.regionId
      }
    );
    console.log(`Sending round trips`);
    return res.json(cheapestRoundTrips);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () =>
  console.log(`Example app is listening on port ${port}`)
);
