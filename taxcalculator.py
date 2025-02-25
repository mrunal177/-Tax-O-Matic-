import streamlit as st
import pandas as pd
import plotly.express as px
import re

# Set page configuration
st.set_page_config(page_title="AI Tax Assistant", page_icon="💰", layout="centered")

# Custom CSS for modern UI
st.markdown(
    """
    <style>
    body {
        background: linear-gradient(135deg, #F4F6F8, #E0E7FF);
        font-family: 'Inter', sans-serif;
        color: #333;
    }
    .main-title {
        font-size: 28px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
        color: #1A73E8;
    }
    .container {
        background-color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        margin: auto;
    }
    .stButton>button {
        background-color: #1A73E8;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 16px;
        width: 100%;
    }
    .stButton>button:hover {
        background-color: #1557B0;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Title
st.markdown(
    "<div class='main-title'>💸 Tax-O-Matic: Because Taxes Don't Calculate Themselves! 💸</div>",
    unsafe_allow_html=True
)

# Salary Input (Manual Entry)
st.subheader("Enter Your Annual Salary (₹)")
salary = st.number_input("Annual Salary (₹):", min_value=0, step=10000, format="%d")

# Dynamic Deductions (Based on Indian Tax Law)
st.subheader("Select Your Eligible Deductions")

deductions = {
    "Standard Deduction (₹50,000)": 50000,
    "EPF (Employee Provident Fund) - Max ₹1.5L": st.number_input("EPF Contribution (₹):", min_value=0, max_value=150000, step=5000),
    "PPF (Public Provident Fund) - Max ₹1.5L": st.number_input("PPF Contribution (₹):", min_value=0, max_value=150000, step=5000),
    "NPS (National Pension Scheme) - Max ₹50K": st.number_input("NPS Contribution (₹):", min_value=0, max_value=50000, step=5000),
    "ELSS (Equity Linked Savings) - Max ₹1.5L": st.number_input("ELSS Investment (₹):", min_value=0, max_value=150000, step=5000),
    "Home Loan Interest (Self-Occupied) - Max ₹2L": st.number_input("Home Loan Interest Paid (₹):", min_value=0, max_value=200000, step=5000),
    "Medical Insurance (80D) - Max ₹25K": st.number_input("Medical Insurance Premium (₹):", min_value=0, max_value=25000, step=5000),
    "Education Loan Interest (80E)": st.number_input("Education Loan Interest Paid (₹):", min_value=0, step=5000),
    "House Rent Allowance (HRA)": st.number_input("HRA Exemption (₹):", min_value=0, step=5000)
}

# Compute Total Deduction
total_deductions = sum(deductions.values())
st.write(f"💡 **Total Deductions Applied: ₹{total_deductions}**")

# Efficient Tax Calculation
def calculate_tax(income):
    """
    Calculate tax using Indian tax slabs.
    """
    tax_brackets = [
        (250000, 0.05),
        (500000, 0.10),
        (750000, 0.15),
        (1000000, 0.20),
        (1250000, 0.25),
        (1500000, 0.30)
    ]
    
    tax = 0
    previous_limit = 0

    for limit, rate in tax_brackets:
        if income > limit:
            tax += (limit - previous_limit) * rate
            previous_limit = limit
        else:
            tax += (income - previous_limit) * rate
            break
    else:
        tax += (income - previous_limit) * 0.30  # Tax for income above 1,500,000 at 30%

    return tax

# Calculate and display results
if st.button("🚀 Calculate Best Tax Option"):
    old_taxable_income = max(0, salary - total_deductions)
    new_taxable_income = salary  # New regime does not allow deductions

    old_tax = calculate_tax(old_taxable_income)
    new_tax = calculate_tax(new_taxable_income)
    
    best_option = "Old Regime" if old_tax < new_tax else "New Regime"

    st.subheader("Results")
    st.write(f"✅ **Old Tax Regime:** ₹{old_tax:.2f}")
    st.write(f"✅ **New Tax Regime:** ₹{new_tax:.2f}")
    st.success(f"🚀 Best Option: **{best_option}**")

    # Visualization
    st.subheader("Tax Comparison")
    df = pd.DataFrame({"Regime": ["Old Regime", "New Regime"], "Tax Amount": [old_tax, new_tax]})
    fig = px.bar(df, x="Regime", y="Tax Amount", text="Tax Amount", color="Regime",
                 title="Tax Comparison: Old vs New Regime",
                 labels={"Tax Amount": "Tax Amount (₹)", "Regime": "Tax Regime"})
    fig.update_traces(texttemplate='₹%{text:,.2f}', textposition='outside')
    fig.update_layout(showlegend=False)
    st.plotly_chart(fig, use_container_width=True)

    # AI-Based Tax Saving Suggestions
    st.subheader("💡 AI-Based Tax Saving Suggestions")
    if best_option == "Old Regime":
        suggestions = []
        if deductions["EPF (Employee Provident Fund) - Max ₹1.5L"] == 0:
            suggestions.append("✅ Consider investing in **EPF** to save up to ₹1.5L under Section 80C.")
        if deductions["PPF (Public Provident Fund) - Max ₹1.5L"] == 0:
            suggestions.append("✅ Investing in **PPF** can reduce your taxable income further.")
        if deductions["NPS (National Pension Scheme) - Max ₹50K"] == 0:
            suggestions.append("✅ **NPS investment** gives an extra ₹50,000 deduction under Section 80CCD(1B).")
        if deductions["Home Loan Interest (Self-Occupied) - Max ₹2L"] == 0:
            suggestions.append("✅ **Home loan interest** can provide ₹2L exemption under Section 24B.")
        if deductions["Medical Insurance (80D) - Max ₹25K"] == 0:
            suggestions.append("✅ Buying **medical insurance** saves tax under Section 80D.")
        for sug in suggestions:
            st.write(sug)
    else:
        st.write("🚀 The **New Regime** has lower tax rates but no exemptions. Invest wisely!")
