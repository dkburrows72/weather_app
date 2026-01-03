import react, { useState } from "react";
import axios from "axios";
import "./App.css";
import Input from "./Input";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import key from "./key";
import { usePersistedState } from "../hooks/usePersistedState";

const cityHeadings = ["City", "State", "Code"];
const weatherHeadings = ["City", "Day", "Night", "Min Temp", "Max Temp"];

function App() {
  const [formData, setFormData] = useState({ city: "", state: "" });
  const [locationCodes, setLocationCodes] = usePersistedState("locationCodes", [
    { city: "Queensbury", state: "NY", key: "2128555" },
  ]);

  // const [locationCodes, setLocationCodes] = useState([
  //   { city: "Queensbury", state: "NY", key: "2128555" },
  // ]);
  const [weatherData, setWeatherData] = useState([]);

  function getLocationCode(location, adminCode, key) {
    axios
      .get("http://localhost:3000/location/" + location + "/" + adminCode)
      .then((response) => {
        console.log(response);
        const locationKey = response.data.key;
        console.log(locationKey);
        if (locationKey) {
          setLocationCodes((locationCodes) => [
            ...locationCodes,
            { city: location, state: adminCode, key: locationKey },
          ]);
        }
      });
  }
  function getWeather(locations, key) {
    setWeatherData([]);
    for (const loc in locations) {
      axios
        .get("http://localhost:3000/weather/" + locations[loc])
        .then((response) => {
          const { id, day, night, minTemp, maxTemp } = response.data;
          const weather = {
            location: locationCodes[loc].city,
            day: day,
            night: night,
            minTemp: minTemp,
            maxTemp: maxTemp,
          };
          setWeatherData((weatherData) => [...weatherData, weather]);
        });
    }
  }

  function handleClick(e) {
    e.preventDefault();
    const locationCode = getLocationCode(formData.city, formData.state, key);
    console.log(formData.city, formData.state, locationCode);
    setFormData({ city: "", state: "" });
  }

  return (
    <div>
      <h1>Travel Weather Tracker</h1>
      <form onSubmit={handleClick} className="form">
        <div className="mb-3">
          <label className="form-label p-2" htmlFor="city">
            City:
          </label>
          <Input
            className="form-control p-2"
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label p-2" htmlFor="state">
            State:
          </label>
          <Input
            className="form-control p-2"
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
          />
        </div>
        <button className="btn btn-primary btn-sm mb-4" onClick={handleClick}>
          Add
        </button>
      </form>
      <table className="table">
        <TableHead headings={cityHeadings} />
        <TableBody items={locationCodes} />
      </table>
      <button
        className="btn btn-primary btn-sm mb-4"
        onClick={() =>
          getWeather(
            locationCodes.map((loc) => loc.key),
            key
          )
        }
      >
        Get Weather
      </button>
      <table className="table">
        <TableHead headings={weatherHeadings} />
        <TableBody items={weatherData} />
      </table>
    </div>
  );
}
export default App;
