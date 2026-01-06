import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";

const key = process.env.API_KEY;

const app = express();
const port = 3000;
const API_URL = "";

const config = {
  headers: { Authorization: `Bearer ${key}` },
};

const corsOptions = {
  origin: "http://frontend:80", // Replace with your frontend's exact origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies/authorization headers
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/location/:city/:state", cors(), async (req, res) => {
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

app.get("/weather/:id", cors(), async (req, res) => {
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
      const { Date, Day, Night, Temperature } = response.data.DailyForecasts[0];
      const weather = {
        id: id,
        date: Date,
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

app.get("/weather-5day/:id", async (req, res) => {
  const id = req.params.id;

  axios
    .get("https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + id, {
      headers: { Authorization: "Bearer " + key },
      params: {
        metric: false,
        details: false,
        language: "en-us",
        format: "json",
      },
    })
    .then((response) => {
      const weatherArray = [];
      response.data.DailyForecasts.forEach((forecast) => {
        const { Date, Day, Night, Temperature } = forecast;
        const weather = {
          id: id,
          date: Date,
          day: Day.IconPhrase,
          night: Night.IconPhrase,
          minTemp: Temperature.Minimum.Value,
          maxTemp: Temperature.Maximum.Value,
        };
        weatherArray.push(weather);
      });

      res.status(200).send(JSON.stringify(weatherArray));
    })
    .catch((error) => {
      res.status(500).send("Error fetching weather data");
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
