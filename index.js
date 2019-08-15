const express = require("express");
const cors = require("cors");
const getCheapestRoundTripPrice = require("./main/");
const writeJsonToFile = require("./misc/helper/");
const app = express();

const origin =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://runarf.github.io";

console.log(`origin allowed is ${origin}`);

app.use(
  cors({
    origin
  })
);

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

    return res.json(cheapestRoundTrips);
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Example app is listening on port ${port}`)
);
