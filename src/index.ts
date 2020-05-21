import * as express from "express";
import * as cors from "cors";
import { getCheapestRoundTripPrice } from "./RoundTrips";
import { Station } from "flix";
import { ThereAndBackTrips } from "./RoundTrips/ConvertJourneysToTrips";

const app = express();

const originUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://runarf.github.io";

console.log(`origin allowed is ${originUrl}`);

app.use(
  cors({
    origin: originUrl,
  })
);

app.get("/:regionId", async (req, res) => {
  try {
    console.log(`Getting round trips`);
    const region: Station = {
      type: "region",
      id: req.params.regionId,
    };

    const cheapestRoundTrips: ThereAndBackTrips = await getCheapestRoundTripPrice(
      2,
      region
    );
    console.log(
      `Sending ${cheapestRoundTrips.there.length} trips there, and ${cheapestRoundTrips.back.length} trips back`
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
