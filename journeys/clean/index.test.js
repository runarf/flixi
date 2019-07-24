const { cleanJourneys } = require("./index");

const journey = {
  legs: [
    {
      origin: {
        id: "4468",
        name: "Görlitz"
      },
      destination: {
        id: "251",
        name: "Dresden central station"
      },
      departure: "2019-07-21T10:05:00+02:00",
      arrival: "2019-07-21T11:40:00+02:00"
    },
    {
      origin: {
        id: "251",
        name: "Dresden central station"
      },
      destination: {
        id: "1224",
        name: "Berlin Alexanderplatz"
      },
      departure: "2019-07-21T13:00:00+02:00",
      arrival: "2019-07-21T15:55:00+02:00"
    }
  ],
  price: {
    amount: 22.98,
    url: "shop.com"
  }
};

const correctCleanedJourney = {
  departure: "2019-07-21T10:05:00+02:00",
  arrival: "2019-07-21T15:55:00+02:00",
  origin: {
    id: "4468",
    name: "Görlitz"
  },
  destination: {
    id: "1224",
    name: "Berlin Alexanderplatz"
  },
  price: 22.98,
  url: "shop.com"
};

const cleanJourney = cleanJourneys([journey]);

test("journey got cleaned correctly", () => {
  expect(cleanJourney).toEqual([correctCleanedJourney]);
});
