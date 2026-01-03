import react from "react";

function WeatherRow({ element }) {
  return (
    <tr>
      <td>{element.location}</td>
      <td>{element.day}</td>
      <td>{element.night}</td>
      <td>{element.minTemp}</td>
      <td>{element.maxTemp}</td>
    </tr>
  );
}

export default WeatherRow;
