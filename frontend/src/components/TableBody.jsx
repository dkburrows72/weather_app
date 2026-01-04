import react from "react";

function TableBody({ items, onClick }) {
  return (
    <tbody>
      {items.map((item) => (
        <tr key={item.key} onClick={onClick}>
          {Object.values(item).map((value, index) => (
            <td key={index}>{value}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
export default TableBody;
