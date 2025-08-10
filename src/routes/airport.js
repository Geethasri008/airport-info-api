const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // cache for 10 minutes

const { AppDataSource } = require("../data-source");

const validateIataCode = (code) => /^[A-Z]{3}$/.test(code);

router.get("/:iata_code", async (req, res) => {
  const iata_code = req.params.iata_code.toUpperCase();

  if (!validateIataCode(iata_code)) {
    return res.status(400).json({ message: "Invalid IATA code format" });
  }

  const cachedData = cache.get(iata_code);
  if (cachedData) {
    console.log("Serving from cache");
    return res.json(cachedData);
  }

  try {
    const airport = await AppDataSource.getRepository("Airport").findOne({
      where: { iata_code },
      relations: {
        city: {
          country: true,
        },
      },
    });

    if (!airport) {
      return res.status(404).json({ message: "Airport not found" });
    }

    const response = {
      airport: {
        id: airport.id,
        icao_code: airport.icao_code,
        iata_code: airport.iata_code,
        name: airport.name,
        type: airport.type,
        latitude_deg: airport.latitude_deg,
        longitude_deg: airport.longitude_deg,
        elevation_ft: airport.elevation_ft,
        address: {
          city: airport.city
            ? {
                id: airport.city.id,
                name: airport.city.name,
                country_id: airport.city.country_id,
                is_active: airport.city.is_active,
                lat: airport.city.lat,
                long: airport.city.long,
              }
            : null,
          country:
            airport.city && airport.city.country
              ? {
                  id: airport.city.country.id,
                  name: airport.city.country.name,
                  country_code_two: airport.city.country.country_code_two,
                  country_code_three: airport.city.country.country_code_three,
                  mobile_code: airport.city.country.mobile_code,
                  continent_id: airport.city.country.continent_id,
                }
              : null,
        },
      },
    };

    cache.set(iata_code, response);

    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
