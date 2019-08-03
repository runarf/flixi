const express = require("express");
const cors = require("cors");
const getCheapestRoundTripPrice = require("./journeys/index.js");
const writeJsonToFile = require("./helper/");
const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

app.get("/:regionId", async (req, res) => {
  try {
    console.log(`Getting round trips`);
    const cheapestRoundTrips = await getCheapestRoundTripPrice(
      2,
      {
        type: "region",
        id: req.params.regionId
      }
    );
    console.log(
      `Sending ${
        cheapestRoundTrips.there.length
      } trips there, and ${
        cheapestRoundTrips.back.length
      } trips back`
    );

    writeJsonToFile(
      cheapestRoundTrips,
      "thereNbackToPrague"
    );

    return res.json(cheapestRoundTrips);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () =>
  console.log(`Example app is listening on port ${port}`)
);
