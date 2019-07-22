import express from "express";
import cors from "cors";
import getCheapestRoundTripPrice from "./journeys/index.mjs";

const app = express();
app.use(cors());
const port = 4000;

app.get("/:regionId", async (req, res) => {
  try {
    const cheapestRoundTrips = await getCheapestRoundTripPrice(
      {
        type: "region",
        id: req.params.regionId
      }
    );
    return res.json(cheapestRoundTrips);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () =>
  console.log(`Example app is listening on port ${port}`)
);
