import React from "react";

const TaxComparison = ({ taxData }) => {
  if (!taxData) return null;

  return (
    <div>
      <h2>Tax Comparison</h2>
      <p>
        <strong>Old Regime Tax:</strong> ₹{taxData.old_tax}
      </p>
      <p>
        <strong>New Regime Tax:</strong> ₹{taxData.new_tax}
      </p>
      <h3>Best Option: {taxData.best_option}</h3>
    </div>
  );
};

export default TaxComparison;
