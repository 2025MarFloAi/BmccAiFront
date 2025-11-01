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
            // If your teammate's endpoint is ready, replace this URL:
            const res = await fetch("https://your-openai-endpoint.com/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            setResult(data.message || JSON.stringify(data));
        } catch (error) {
            // Mocked AI response for demo
            setResult(
                "📊 Based on your inputs, here’s an educational summary:\n\n" +
                "• Consider building a small emergency fund.\n" +
                "• Reduce variable spending by 10%.\n" +
                "• Pay off high-interest debt first.\n\n" +
                "💡 This information is for educational purposes only and not financial advice."
            );
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
