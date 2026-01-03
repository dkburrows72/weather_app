import react from "react";

function TableBody({ items }) {
  return (
    <tbody>
      {items.map((item) => (
        <tr key={item.key}>
          {Object.values(item).map((value, index) => (
            <td key={index}>{value}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
export default TableBody;
