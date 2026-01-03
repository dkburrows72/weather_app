import react from "react";

function TableHead({ headings }) {
  return (
    <thead>
      <tr>
        {headings.map((heading, index) => (
          <th key={index}>{heading}</th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHead;
