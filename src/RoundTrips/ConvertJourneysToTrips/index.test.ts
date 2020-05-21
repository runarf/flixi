import { Trip, convertJourneyToTrip } from "./index";
import { Journey } from "flix";

const firstLeg = {
  origin: [
    {
      id: "4468",
      name: "Görlitz",
    },
  ],
  destination: {
    id: "251",
    name: "Dresden central station",
  },
  departure: "2019-07-21T10:05:00+02:00",
  arrival: "2019-07-21T11:40:00+02:00",
};

const secondLeg = {
  origin: {
    id: "251",
    name: "Dresden central station",
  },
  destination: {
    id: "1224",
    name: "Berlin Alexanderplatz",
  },
  departure: "2019-07-21T13:00:00+02:00",
  arrival: "2019-07-21T15:55:00+02:00",
};

const journey: Journey = {
  legs: [firstLeg, secondLeg],
  price: {
    amount: 22.98,
    url: "shop.com",
  },
} as Journey;

const correctTrip: Trip = {
  departure: "2019-07-21T10:05:00+02:00",
  arrival: "2019-07-21T15:55:00+02:00",
  origin: [
    {
      id: "4468",
      name: "Görlitz",
    },
  ],
  destination: [
    {
      id: "1224",
      name: "Berlin Alexanderplatz",
    },
  ],
  isDirect: false,
  price: 22.98,
  url: "shop.com",
};

const trip: Trip = convertJourneyToTrip(journey);

test("journey got cleaned correctly", () => {
  expect(trip).toEqual(correctTrip);
});
