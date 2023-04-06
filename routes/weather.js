const router = require("express").Router();
const axios = require("axios");

const config = {
  headers: {
    "User-Agent": process.env.USER_AGENT,
  },
};

router.get("", async (req, res, next) => {
  try {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (ip === "::1") {
      ip = process.env.LOCAL_IP;
    }
    const ipApi = await axios.get(`http://ip-api.com/json/${ip}`); //https://ip-api.com/docs/api:json
    const lat = ipApi.data.lat;
    const lon = ipApi.data.lon;
    const stationResponse = await axios.get(
      `https://api.weather.gov/points/${lat},${lon}`,
      config,
    );
    const grid = stationResponse.data.properties;
    const gridId = grid.gridId; //may need cwa instead of gridId
    const gridX = grid.gridX;
    const gridY = grid.gridY;
    const city = grid.relativeLocation.properties.city;
    const state = grid.relativeLocation.properties.state;

    const forecast = await axios.get(
      `https://api.weather.gov/gridpoints/${gridId}/${parseInt(
        gridX,
      )},${parseInt(gridY)}/forecast`,
      config,
    );
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

// router.get("/:ip", async (req, res, next) => {
//   try {
//     let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//     if (ip === "::1") {
//       ip = process.env.LOCAL_IP;
//     }
//     const ipApi = await axios.get(`http://ip-api.com/json/${ip}`); //https://ip-api.com/docs/api:json
//     const lat = ipApi.data.lat;
//     const lon = ipApi.data.lon;
//     const stationResponse = await axios.get(
//       `https://api.weather.gov/points/${lat},${lon}`,
//       config,
//     );
//     const grid = stationResponse.data.properties;
//     const gridId = grid.gridId; //may need cwa instead of gridId
//     const gridX = grid.gridX;
//     const gridY = grid.gridY;
//     const city = grid.relativeLocation.properties.city;
//     const state = grid.relativeLocation.properties.state;

//     const forecast = await axios.get(
//       `https://api.weather.gov/gridpoints/${gridId}/${parseInt(
//         gridX,
//       )},${parseInt(gridY)}/forecast`,
//       config,
//     );
//     const weatherBundle = {
//       city: city,
//       state: state,
//       forecast: forecast.data,
//     };
//     res.send(weatherBundle);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/:latitude,:longitude", async (req, res, next) => {
  try {
    const stationResponse = await axios.get(
      `https://api.weather.gov/points/${req.params.latitude},${req.params.longitude}`,
      config,
    );
    const grid = stationResponse.data.properties;
    const gridId = grid.gridId; //may need cwa instead of gridId
    const gridX = grid.gridX;
    const gridY = grid.gridY;
    const city = grid.relativeLocation.properties.city;
    const state = grid.relativeLocation.properties.state;

    const forecast = await axios.get(
      `https://api.weather.gov/gridpoints/${gridId}/${parseInt(
        gridX,
      )},${parseInt(gridY)}/forecast`,
      config,
    );
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
