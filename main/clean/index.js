const cleanJourneys = journeys => {
  return journeys.map(journey => {
    const legs = journey.legs;

    const departureLeg = legs[0];
    const arrivalLeg = legs[legs.length - 1];

    const origin = Array.isArray(departureLeg.origin)
      ? departureLeg.origin
      : [
          {
            id: departureLeg.origin.id,
            name: departureLeg.origin.name
          }
        ];

    const destination = Array.isArray(
      arrivalLeg.destination
    )
      ? arrivalLeg.destination
      : [
          {
            id: arrivalLeg.destination.id,
            name: arrivalLeg.destination.name
          }
        ];

    const cleanedJourney = {
      departure: departureLeg.departure,
      arrival: arrivalLeg.arrival,
      origin,
      destination,
      price: journey.price.amount,
      url: journey.price.url,
      isDirect: legs.length === 1
    };

    return cleanedJourney;
  });
};

const cleanJourneysThereAndBack = journeysThereAndBack => {
  return {
    there: cleanJourneys(journeysThereAndBack.there),
    back: cleanJourneys(journeysThereAndBack.back)
  };
};

module.exports = {
  cleanJourneys,
  cleanJourneysThereAndBack
};
