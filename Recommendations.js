import React from "react";

const Recommendations = ({ taxData }) => {
  if (!taxData || !taxData.recommendations) return null;

  return (
    <div>
      <h2>Tax-Saving Recommendations</h2>
      {taxData.recommendations.map((rec, index) => (
        <p key={index}>✅ {rec}</p>
      ))}
    </div>
  );
};

export default Recommendations;
