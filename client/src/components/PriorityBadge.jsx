import React from "react";
import "./Badge.css"; 

const PriorityBadge = ({ priority }) => {
  let color = "";

  switch (priority) {
    case "High":
      color = "#e53e3e"; // red
      break;
    case "Medium":
      color = "#ed8936"; // orange
      break;
    case "Low":
      color = "#38a169"; // green
      break;
    default:
      color = "#718096"; // gray
  }

  return (
    <span
      className="badge"
      style={{
        backgroundColor: color,
        color: "white",
        padding: "3px 10px",
        borderRadius: "6px",
        fontSize: "0.8rem",
        fontWeight: "500",
      }}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
