import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div style={{ width: "100%", backgroundColor: "#4b4b4b", borderRadius: "6px", height: "20px", position: "relative" }}>
      <div
        style={{
          width: `${progress}%`,
          backgroundColor: progress >= 80 ? "#4caf50" : progress >= 50 ? "#ff9800" : "#f44336",
          height: "100%",
          borderRadius: "6px",
          textAlign: "center",
          color: "#fff",
          lineHeight: "20px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
