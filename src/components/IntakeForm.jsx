import React, { useState } from "react";
import { API_URL } from "../shared";
import "./IntakeForm.css";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const IntakeForm = () => {
    const [taxData, setTaxData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [formData, setFormData] = useState({
        hasJob: "",
        grossIncome: "",
        netIncome: "",
        maritalStatus: "",
        expenses: "",
        debts: "",
        savings: "",
        goal: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const calculateTaxBreakdown = () => {
        const gross = parseFloat(formData.grossIncome) || 0;
        if (!gross) return null;

        // Base rates (NY)
        let federalRate = 0.17;
        const ficaRate = 0.0765;
        const stateRate = 0.053;
        const localRate = 0.0359;

        // Adjust slightly for married filers
        if (formData.maritalStatus === "married") federalRate -= 0.02;

        const federal = gross * federalRate;
        const fica = gross * ficaRate;
        const state = gross * stateRate;
        const local = gross * localRate;
        const totalTax = federal + fica + state + local;
        const effectiveRate = ((totalTax / gross) * 100).toFixed(2);
        const netAfterTax = gross - totalTax;

        return { federal, fica, state, local, totalTax, effectiveRate, netAfterTax };
    };

    const generateChartData = () => {
        const gross = parseFloat(formData.grossIncome) || 0;
        const net = parseFloat(formData.netIncome) || gross * 0.87;
        const expenses = parseFloat(formData.expenses) || 0;
        const savings = parseFloat(formData.savings) || 0;
        const taxes = gross - net;
        const remaining = net - expenses - savings;

        return {
            labels: ["Taxes", "Expenses", "Savings", "Remaining"],
            datasets: [
                {
                    data: [taxes, expenses, savings, remaining > 0 ? remaining : 0],
                    backgroundColor: ["#ef4444", "#3b82f6", "#22c55e", "#facc15"],
                    hoverOffset: 8,
                },
            ],
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const prompt = `
A student reported these financial details:
- Marital status: ${formData.maritalStatus || "N/A"}
- Employment status: ${formData.hasJob === "yes" ? "Employed" : "Unemployed"}
- Gross monthly income: $${formData.grossIncome || "N/A"}
- Net monthly income: $${formData.netIncome || "N/A"}
- Monthly expenses: $${formData.expenses}
- Total debt: $${formData.debts}
- Savings: $${formData.savings}
- Main goal: ${formData.goal}

Provide an educational summary explaining how marital status can affect taxes, take-home pay, and financial planning.
If net income is blank, estimate take-home pay (85–90% of gross) and use that for guidance.
Then, generate 3 personalized budgeting tips and end with an educational disclaimer.
`;

            const res = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            setResult(data.answer || "No response from AI 😅");
            setChartData(generateChartData());
            setTaxData(calculateTaxBreakdown());
        } catch (error) {
            console.error("Error calling AI endpoint:", error);
            setResult("Could not connect to AI. Please try again later.");
        }

        setLoading(false);
    };

    const formatResultText = (text) => {
        return text
            .replace(/(\$[0-9,]+)/g, "<span class='money'>$1</span>")
            .replace(/(save|saving|saved)/gi, "<span class='highlight'>$1</span>");
    };

    return (
        <div className="intake-container">
            <h2>Financial Intake Form</h2>
            <p>
                Answer a few quick questions to receive a personalized educational
                summary.
            </p>

            <form onSubmit={handleSubmit}>
                <label>Do you currently have a job?</label>
                <select
                    name="hasJob"
                    value={formData.hasJob}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select --</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                <label>Marital Status:</label>
                <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select --</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                </select>

                {formData.hasJob === "yes" && (
                    <>
                        <label>Gross Monthly Income (before taxes):</label>
                        <input
                            type="number"
                            name="grossIncome"
                            placeholder="e.g. 2000"
                            value={formData.grossIncome}
                            onChange={handleChange}
                        />

                        <label>Net Monthly Income (after taxes):</label>
                        <input
                            type="number"
                            name="netIncome"
                            placeholder="e.g. 1800"
                            value={formData.netIncome}
                            onChange={handleChange}
                        />

                        <small className="hint">
                            If unsure, your take-home pay is usually 85–90% of your gross pay
                            after taxes and deductions.
                        </small>
                    </>
                )}

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

            {/* Chart Section */}
            {chartData && (
                <div className="chart-container">
                    <h3>Your Financial Breakdown</h3>
                    <Pie data={chartData} />
                    <p className="chart-note">
                        * Taxes are estimated based on gross vs. net income (approx. 10–15%
                        deduction if unspecified).
                    </p>
                </div>
            )}

            {/* Tax Breakdown Section */}
            {taxData && (
                <div className="tax-table-container">
                    <h3>
                        Your Income Taxes Breakdown (
                        {formData.maritalStatus === "married" ? "Married Filer" : "Single Filer"})
                    </h3>

                    <table className="tax-table">
                        <thead>
                            <tr>
                                <th>Tax Type</th>
                                <th>Effective Rate</th>
                                <th>Estimated Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Federal</td>
                                <td>17.00%</td>
                                <td>${taxData.federal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>FICA</td>
                                <td>7.65%</td>
                                <td>${taxData.fica.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>State</td>
                                <td>5.30%</td>
                                <td>${taxData.state.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Local</td>
                                <td>3.59%</td>
                                <td>${taxData.local.toFixed(2)}</td>
                            </tr>
                            <tr className="highlight">
                                <td><strong>Total Income Taxes</strong></td>
                                <td><strong>{taxData.effectiveRate}%</strong></td>
                                <td><strong>${taxData.totalTax.toFixed(2)}</strong></td>
                            </tr>
                            <tr>
                                <td>Income After Taxes</td>
                                <td></td>
                                <td>${taxData.netAfterTax.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* AI Summary Section (bottom) */}
            {result && (
                <div className="ai-summary">
                    <h3 className="summary-title">💡 AI Financial Summary</h3>
                    <div className="summary-content">
                        <p
                            className="summary-text"
                            dangerouslySetInnerHTML={{ __html: formatResultText(result) }}
                        ></p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntakeForm;
