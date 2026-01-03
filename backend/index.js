import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import key from "./key.js";

const app = express();
const port = 3000;
const API_URL = "";

const config = {
  headers: { Authorization: `Bearer ${key}` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/location/:city/:state", async (req, res) => {
  const city = req.params.city;
  const state = req.params.state;

  axios
    .get("https://dataservice.accuweather.com/locations/v1/search", {
      headers: { Authorization: "Bearer " + key },
      params: {
        q: city,
        adminCode: state,
        alias: 2,
        countryCode: "US",
        offset: -1,
        format: "json",
        details: false,
        language: "en-us",
      },
    })
    .then((response) => {
      console.log(response);
      const locationKey = { key: response.data[0].Key };
      console.log(locationKey);
      if (locationKey) {
        res.status(200).send(JSON.stringify(locationKey));
      } else {
        res.status(404).send("Location not found");
      }
    });
});

app.get("/weather/:id", async (req, res) => {
  const id = req.params.id;

  axios
    .get("https://dataservice.accuweather.com/forecasts/v1/daily/1day/" + id, {
      headers: { Authorization: "Bearer " + key },
      params: {
        metric: false,
        details: false,
        language: "en-us",
        format: "json",
      },
    })
    .then((response) => {
      const { Day, Night, Temperature } = response.data.DailyForecasts[0];
      const weather = {
        id: id,
        day: Day.IconPhrase,
        night: Night.IconPhrase,
        minTemp: Temperature.Minimum.Value,
        maxTemp: Temperature.Maximum.Value,
      };
      res.status(200).send(JSON.stringify(weather));
    })
    .catch((error) => {
      res.status(500).send("Error fetching weather data");
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
