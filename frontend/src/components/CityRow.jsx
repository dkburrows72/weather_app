import react from "react";

function CityRow({ element }) {
  return (
    <tr>
      <td>{element.city}</td>
      <td>{element.state}</td>
      <td>{element.key}</td>
    </tr>
  );
}

export default CityRow;
