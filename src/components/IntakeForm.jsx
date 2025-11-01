import React, { useState } from "react";
import "./IntakeForm.css";

const IntakeForm = () => {
    const [formData, setFormData] = useState({
        income: "",
        expenses: "",
        debts: "",
        savings: "",
        goal: "",
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const prompt = `
      A student reported these financial details:
      - Monthly income: $${formData.income}
      - Monthly expenses: $${formData.expenses}
      - Total debt: $${formData.debts}
      - Savings: $${formData.savings}
      - Main goal: ${formData.goal}

      Generate a short educational budget summary with 3 practical tips.
      Keep it encouraging and easy to read for college students.
    `;

            // If your teammate's endpoint is ready, replace this URL:
            const res = await fetch("http://localhost:8080/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            setResult(data.answer || "No response from AI 😅");
        } catch (error) {
            console.error("Error calling AI endpoint:", error);
            setResult("Could not connect to AI. Please try again later.");
        }

        setLoading(false);
    };

    return (
        <div className="intake-container">
            <h2>Financial Intake Form</h2>
            <p>
                Answer a few quick questions to receive a personalized educational
                summary.
            </p>

            <form onSubmit={handleSubmit}>
                <label>Monthly Income ($):</label>
                <input
                    type="number"
                    name="income"
                    placeholder="e.g. 1200"
                    value={formData.income}
                    onChange={handleChange}
                    required
                />

                <label>Monthly Expenses ($):</label>
                <input
                    type="number"
                    name="expenses"
                    placeholder="e.g. 900"
                    value={formData.expenses}
                    onChange={handleChange}
                    required
                />

                <label>Total Debt ($):</label>
                <input
                    type="number"
                    name="debts"
                    placeholder="e.g. 3500"
                    value={formData.debts}
                    onChange={handleChange}
                    required
                />

                <label>Total Savings ($):</label>
                <input
                    type="number"
                    name="savings"
                    placeholder="e.g. 500"
                    value={formData.savings}
                    onChange={handleChange}
                />

                <label>Main Financial Goal:</label>
                <input
                    type="text"
                    name="goal"
                    placeholder="e.g. Pay off my credit card or start saving for a laptop"
                    value={formData.goal}
                    onChange={handleChange}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze My Finances"}
                </button>
            </form>

            {result && (
                <div className="result-box">
                    <h3>AI Financial Summary</h3>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
};

export default IntakeForm;
