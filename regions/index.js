const flix = require("flix");
const helper = require("../helper");

const fetchRegions = () => {
  const regionStream = flix.regions.all();
  const regions = [];
  regionStream.on("data", region => {
    regions.push(region);
  });

  regionStream.on("end", () => {
    helper.writeJsonToFile(regions, "allRegions");
  });
};

const getRegionsIn = countryCodes => {
  const allRegions = require("../jsons/allRegions.json");

  const regions = allRegions.filter(region => {
    const countryCode = region.location.country.code;
    return countryCodes.includes(countryCode);
  });

  helper.writeJsonToFile(regions, "regionsCloseToBerlin");
};

const getCountriesWhereFlixDrives = regions => {
  return regions
    .reduce((countries, region) => {
      if (
        countries.includes(
          `${region.countryCode} ${region.country}`
        )
      ) {
        return countries;
      } else {
        return [
          ...countries,
          `${region.countryCode} ${region.country}`
        ];
      }
    }, [])
    .sort((a, b) => a.country.localeCompare(b.country));
};

const cleanRegions = regions => {
  const cleanRegions = regions
    .map(region => {
      const cleanRegion = {
        id: region.id,
        name: region.name,
        countryCode: region.location.country.code
      };
      return cleanRegion;
    })
    .sort((a, b) =>
      a.countryCode.localeCompare(b.countryCode)
    );
  return cleanRegions;
  //helper.writeJsonToFile(cleanRegions, "regionsCloseToBerlin")
};

const getRegionsCloseToBerlinWithDirect = regions => {
  const countriesCloseToBerlin = [
    "AT",
    "BE",
    "CZ",
    "DK",
    "DE",
    "NL",
    "PL"
  ];
  const berlinRegion = { type: "Region", code: "88" };
  const berlinLocation = {
    longitude: 13.404616,
    latitude: 52.486081
  };

  const kmInLongitudeDegree =
    111.32 *
    Math.cos((berlinLocation.latitude / 180.0) * Math.PI);
  const radiusInKm = 600;
  const deltaLat = radiusInKm / 111.1;
  const deltaLong = radiusInKm / kmInLongitudeDegree;

  const minLat = berlinLocation.latitude - deltaLat;
  const maxLat = berlinLocation.latitude + deltaLat;
  const minLong = berlinLocation.longitude - deltaLong;
  const maxLong = berlinLocation.longitude + deltaLong;

  const regionsCloseToBerlinWithDirect = regions
    .filter(region => {
      return region.connections.includes(
        Number(berlinRegion.code)
      );
    })
    .filter(region => {
      const { longitude, latitude } = region.location;
      const regionIsInsideLongitude =
        longitude > minLong && longitude < maxLong;
      const regionIsInsideLatitude =
        latitude > minLat && latitude < maxLat;

      return (
        regionIsInsideLatitude && regionIsInsideLongitude
      );
    });

  return regionsCloseToBerlinWithDirect;

  console.log(regionsCloseToBerlinWithDirect.length);
  helper.writeJsonToFile(
    cleanRegions(regionsCloseToBerlinWithDirect),
    "regionsCloseToBerlinWithDirect"
  );
};

const getRegionsByCountry = regions => {
  const regionsByCountry = regions.reduce(
    (countries, region) => {
      const countryCode = region.countryCode;
      if (countries.hasOwnProperty(countryCode)) {
        countries[countryCode] = [
          ...countries[countryCode],
          region
        ];
      } else {
        countries[countryCode] = [region];
      }
      return countries;
    },
    {}
  );

  return regionsByCountry;
};

const regionsCloseToBerlin = getRegionsCloseToBerlinWithDirect(
  require("../jsons/allRegions.json")
);

const dividedByCountry = getRegionsByCountry(
  cleanRegions(regionsCloseToBerlin)
);
helper.writeJsonToFile(
  dividedByCountry,
  "dividedByCountry"
);
