const cleanJourneys = journeys => {
  return journeys.map(journey => {
    const legs = journey.legs.map(leg => {
      return {
        origin: {
          id: leg.origin.id,
          name: leg.origin.name
        },
        destination: {
          id: leg.destination.id,
          name: leg.destination.name
        },
        departure: leg.departure,
        arrival: leg.arrival
      };
    });

    const cleanedJourney = {
      departure: legs[0].departure,
      arrival: legs[legs.length - 1].arrival,
      legs,
      price: {
        amount: journey.price.amount,
        available: journey.price.available,
        url: journey.price.url
      }
    };

    return cleanedJourney;
  });
};

module.exports = {
  cleanJourneys
};
