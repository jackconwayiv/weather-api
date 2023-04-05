const router = require("express").Router();
const axios = require("axios");

const config = {
  headers: {
    "User-Agent": process.env.USER_AGENT,
  },
};

//get - split this into two endpoints, one with params and one without (for my local weather)
router.get("/:latitude,:longitude", async (req, res, next) => {
  try {
    // const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // console.log("========", ip);
    // console.log(req.socket.remoteAddress);
    const ipApi = await axios.get(`http://ip-api.com/json/`); //https://ip-api.com/docs/api:json
    const lat = ipApi.data.lat;
    const lon = ipApi.data.lon;
    // console.log("lat: ", lat, " lon: ", lon);
    const stationResponse = await axios.get(
      `https://api.weather.gov/points/${lat},${lon}`,
      config,
    );
    // const stationResponse = await axios.get(
    //   `https://api.weather.gov/points/${req.params.latitude},${req.params.longitude}`,
    //   config,
    // );
    const grid = stationResponse.data.properties;
    const gridId = grid.gridId; //may need cwa instead of gridId
    const gridX = grid.gridX;
    const gridY = grid.gridY;
    console.log(grid.timeZone);
    const city = grid.relativeLocation.properties.city;
    const state = grid.relativeLocation.properties.state;

    const forecast = await axios.get(
      `https://api.weather.gov/gridpoints/${gridId}/${parseInt(
        gridX,
      )},${parseInt(gridY)}/forecast`,
      config,
    );
    console.log(`second request done`);
    const weatherBundle = {
      city: city,
      state: state,
      forecast: forecast.data,
    };
    res.send(weatherBundle);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

//https://api.weather.gov/points/33.5268,-112.0844
//https://api.weather.gov/zones/forecast/AZZ544
