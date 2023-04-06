const router = require("express").Router();
const axios = require("axios");

const config = {
  headers: {
    "User-Agent": process.env.USER_AGENT,
  },
};

//get lat and long by ip
router.get("/ip/:ip", async (req, res, next) => {
  try {
    let ip = req.params.ip;
    const ipApi = await axios.get(`http://ip-api.com/json/${ip}`); //https://ip-api.com/docs/api:json
    const lat = ipApi.data.lat;
    const lon = ipApi.data.lon;
    res.send({ lat, lon });
  } catch (error) {
    next(error);
  }
});

//get stationGrid by lat and lon
router.get("/ll/:lat,:lon", async (req, res, next) => {
  try {
    const stationResponse = await axios.get(
      `https://api.weather.gov/points/${req.params.lat},${req.params.lon}`,
      config,
    );
    const grid = stationResponse.data.properties;
    const gridId = grid.gridId; //may need cwa instead of gridId
    const gridX = grid.gridX;
    const gridY = grid.gridY;
    const city = grid.relativeLocation.properties.city;
    const state = grid.relativeLocation.properties.state;
    const stationBundle = {
      city,
      state,
      grid,
      gridId,
      gridX,
      gridY,
    };
    res.send(stationBundle);
  } catch (error) {
    next(error);
  }
});

//get weather by stationGrid (this can be handled using the link provided by station object)
router.get("/:gridId/:gridX,:gridY", async (req, res, next) => {
  try {
    const response = await axios.get(
      `https://api.weather.gov/gridpoints/${req.params.gridId}/${req.params.gridX},${req.params.gridY}/forecast`,
      config,
    );
    const weatherBundle = {
      forecast: response.data,
    };
    res.send(weatherBundle);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
