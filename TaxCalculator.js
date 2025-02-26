import React, { useState } from "react";
import "./TaxCalculator.css";

const TaxCalculator = () => {
  const [salary, setSalary] = useState("");
  const [deductions, setDeductions] = useState({
    "Employee Provident Fund (EPF) - Max ₹1.5L": "",
    "National Pension System (NPS) - Max ₹50K": "",
    "Public Provident Fund (PPF)": "",
    "Life Insurance Premium (80C)": "",
    "Health Insurance (80D)": "",
    "Home Loan Interest (24B)": "",
    "Education Loan Interest (80E)": "",
    "Other Deductions": "",
    "Tax-saving Fixed Deposit": "",
    "Donations (80G)": "",
    "Interest on Savings Account (80TTA)": "",
    "Dividends Received": "",
    "Entertainment Deductions": "",
    "Parent Medical Expenses": "",
    "Travel Allowance": "",
    "Rent Paid": "",
  });
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState("");

  const calculateOldTax = (income) => {
    let tax = 0;
    if (income <= 250000) return 0;
    else if (income <= 500000) tax = 0.05 * (income - 250000);
    else if (income <= 1000000) tax = 0.05 * 250000 + 0.2 * (income - 500000);
    else tax = 0.05 * 250000 + 0.2 * 500000 + 0.3 * (income - 1000000);
    return tax + tax * 0.04;
  };

  const calculateNewTax = (income) => {
    let tax = 0;
    if (income <= 250000) return 0;
    else if (income <= 500000) tax = 0.05 * (income - 250000);
    else if (income <= 750000) tax = 0.05 * 250000 + 0.1 * (income - 500000);
    else if (income <= 1000000)
      tax = 0.05 * 250000 + 0.1 * 250000 + 0.15 * (income - 750000);
    else if (income <= 1250000)
      tax =
        0.05 * 250000 + 0.1 * 250000 + 0.15 * 250000 + 0.2 * (income - 1000000);
    else
      tax =
        0.05 * 250000 +
        0.1 * 250000 +
        0.15 * 250000 +
        0.2 * 250000 +
        0.3 * (income - 1250000);
    return tax + tax * 0.04;
  };

  const handleCalculate = () => {
    const totalDeductions = Object.values(deductions).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );
    const taxableIncome = Math.max(0, salary - totalDeductions);

    const oldTax = calculateOldTax(taxableIncome);
    const newTax = calculateNewTax(taxableIncome);
    const bestOption = newTax < oldTax ? "New Regime" : "Old Regime";

    setResult({ oldTax, newTax, bestOption });

    setAnalysis(`
      <h4>Best Tax Option:</h4>
      <p>The best option for you is the <strong>${bestOption}</strong>.</p>
      <h4>Suggestions:</h4>
      ${
        bestOption === "Old Regime"
          ? `<p>Since the Old Regime benefits those with higher deductions, consider maximizing Section 80C investments like EPF, PPF, and NPS.</p>`
          : `<p>The New Regime is beneficial for those with fewer deductions. If you wish to save more, explore tax-efficient investment options outside 80C.</p>`
      }
    `);
  };

  return (
    <div className="tax-calculator">
      <h2>Tax Calculator</h2>
      <div className="input-section">
        <label>Annual Salary (₹)</label>
        <input
          type="number"
          placeholder="Enter salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
      </div>

      <h3>Deductions</h3>
      <div className="deductions-container">
        {Object.keys(deductions).map((key) => (
          <div className="deduction-item" key={key}>
            <label>{key}</label>
            <input
              type="number"
              placeholder="₹0"
              value={deductions[key]}
              onChange={(e) =>
                setDeductions({ ...deductions, [key]: e.target.value })
              }
            />
          </div>
        ))}
      </div>

      <button className="calculate-btn" onClick={handleCalculate}>
        Calculate Tax
      </button>

      {result && (
        <div className="result-section">
          <h3>Results</h3>
          <p>
            <strong>Old Tax Regime:</strong> ₹{result.oldTax.toFixed(2)}
          </p>
          <p>
            <strong>New Tax Regime:</strong> ₹{result.newTax.toFixed(2)}
          </p>
          <p>
            <strong>Best Option:</strong> {result.bestOption}
          </p>
        </div>
      )}

      {analysis && (
        <div
          className="detailed-analysis"
          dangerouslySetInnerHTML={{ __html: analysis }}
        ></div>
      )}
    </div>
  );
};

export default TaxCalculator;
