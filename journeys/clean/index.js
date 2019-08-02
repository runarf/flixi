const cleanJourneys = journeys => {
  return journeys.map(journey => {
    const legs = journey.legs;

    const departureLeg = legs[0];
    const arrivalLeg = legs[legs.length - 1];
    const cleanedJourney = {
      departure: departureLeg.departure,
      arrival: arrivalLeg.arrival,
      origin: {
        id: departureLeg.origin.id,
        name: departureLeg.origin.name
      },
      destination: {
        id: arrivalLeg.destination.id,
        name: arrivalLeg.destination.name
      },
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
