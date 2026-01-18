import React from "react";
import "./Badge.css"; 

const StatusBadge = ({ status }) => {
  let color = "";

  switch (status) {
    case "Completed":
      color = "#38a169"; // green
      break;
    case "Ongoing":
      color = "#3182ce"; // blue
      break;
    case "Pending":
      color = "#d69e2e"; // yellow
      break;
    case "Cancelled":
      color = "#e53e3e"; // red
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
      {status}
    </span>
  );
};

export default StatusBadge;
