const express = require("express");
const cors = require("cors");
const getCheapestRoundTripPrice = require("./journeys/index.js");

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

app.get("/:regionId", async (req, res) => {
  try {
    console.log(`Getting round trips`);
    const cheapestRoundTrips = await getCheapestRoundTripPrice(
      1,
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
