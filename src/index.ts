import * as express from "express";
import * as cors from "cors";
import { getThereAndBackTrips } from "./getThereAndBackTrips";
import { Station } from "flix";
import { ThereAndBackTrips } from "./TripInterfaces";

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

    const thereAndBackTrips: ThereAndBackTrips = await getThereAndBackTrips(
      2,
      region
    );
    console.log(
      `Sending ${thereAndBackTrips.there.length} trips there, and ${thereAndBackTrips.back.length} trips back`
    );

    return res.json(thereAndBackTrips);
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Example app is listening on port ${port}`)
);
