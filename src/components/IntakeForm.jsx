import React, { useState, useEffect } from "react";
import "./IntakeForm.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const IntakeForm = () => {
    const [taxData, setTaxData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [submitted, setSubmitted] = useState(false);


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

    /* 🧩 Add this useEffect below */
    useEffect(() => {
        const handleGoalClick = (e) => {
            if (e.target.classList.contains("goal-btn")) {
                const tip = e.target.parentElement.textContent
                    .replace("+ Add to Goals", "")
                    .trim();
                alert(`Goal added: "${tip}"`);
            }
        };

        document.addEventListener("click", handleGoalClick);

        // Clean up when component unmounts
        return () => {
            document.removeEventListener("click", handleGoalClick);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const calculateTaxBreakdown = () => {
        const gross = parseFloat(formData.grossIncome) || 0;
        if (!gross) return null;

        // Base NY rates
        let federalRate = 0.17;
        const ficaRate = 0.0765;
        const stateRate = 0.053;
        const localRate = 0.0359;
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
        setSubmitted(true);

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

Please return your answer in this format:

SUMMARY:
(A one-sentence key takeaway)

TIPS:
1. (First practical tip)
2. (Second practical tip)
3. (Third practical tip)

DISCLAIMER:
(One short line about this being educational)
`;


            const res = await fetch("http://localhost:8080/api/chat", {
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
        if (!text) return "";

        const summaryMatch = text.match(/SUMMARY:(.*?)(?=TIPS:|DISCLAIMER:|$)/is);
        const tipsMatch = text.match(/TIPS:(.*?)(?=DISCLAIMER:|$)/is);
        const disclaimerMatch = text.match(/DISCLAIMER:(.*)$/is);

        const summary = summaryMatch ? summaryMatch[1].trim() : "";
        const tips = tipsMatch
            ? tipsMatch[1]
                .trim()
                .split(/\d+\.\s*/)
                .filter((tip) => tip.length > 0)
            : [];
        const disclaimer = disclaimerMatch ? disclaimerMatch[1].trim() : "";

        let html = "";

        if (summary) {
            html += `
      <div class="summary-section">
        <h4>📊 Summary</h4>
        <p>${summary}</p>
      </div>`;
        }

        if (tips.length > 0) {
            html += `
      <div class="tips-section">
        <h4>💡 AI Tips</h4>
        <ul>
          ${tips
                    .map(
                        (t) => `
              <li>
                <span class="tip-text">${t}</span>
                <button class="goal-btn">+ Add to Goals</button>
              </li>`
                    )
                    .join("")}
        </ul>
      </div>`;
        }

        if (disclaimer) {
            html += `
      <div class="disclaimer-section">
        <p>⚠️ ${disclaimer}</p>
      </div>`;
        }

        return html
            .replace(/(\$[0-9,]+)/g, "<span class='money'>$1</span>")
            .replace(/(save|saving|saved)/gi, "<span class='highlight'>$1</span>");
    };




    return (
        <div className="intake-container">
            <h2>Financial Intake Form</h2>
            <p>Answer a few quick questions to receive a personalized educational summary.</p>

            <form onSubmit={handleSubmit}>
                <label>Do you currently have a job?</label>
                <select name="hasJob" value={formData.hasJob} onChange={handleChange} required>
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
                            required
                        />

                        <label>Net Monthly Income (after taxes):</label>
                        <input
                            type="number"
                            name="netIncome"
                            placeholder="(Optional) e.g. 1800"
                            value={formData.netIncome}
                            onChange={handleChange}
                        />

                        <small className="hint">
                            If unsure, leave this blank. We’ll estimate your take-home pay at 85–90% of your gross.
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
                <>
                    <div className="chart-container">
                        <h3>Your Financial Breakdown</h3>
                        <Pie data={chartData} />
                        <p className="chart-note">
                            * Taxes are estimated based on gross vs. net income (approx. 10–15% deduction if unspecified).
                        </p>
                    </div>

                    {/* Budget Stress Level */}
                    {(() => {
                        const gross = parseFloat(formData.grossIncome) || 0;
                        const net = parseFloat(formData.netIncome) || gross * 0.87;
                        const expenses = parseFloat(formData.expenses) || 0;
                        const stressLevel = Math.min(100, Math.round((expenses / net) * 100));
                        return (
                            <div className="budget-stress">
                                <p>Budget Stress Level: {stressLevel}%</p>
                                <div className="progress-bar">
                                    <div
                                        className="progress"
                                        style={{
                                            width: `${stressLevel}%`,
                                            backgroundColor:
                                                stressLevel < 60
                                                    ? "#22c55e"
                                                    : stressLevel < 85
                                                        ? "#facc15"
                                                        : "#ef4444",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })()}
                </>
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

            {/* AI Summary Section */}
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

            {/* Food Assistance Section */}
            {submitted && (() => {
                const gross = parseFloat(formData.grossIncome) || 0;
                const net = parseFloat(formData.netIncome) || gross * 0.87;
                const expenses = parseFloat(formData.expenses) || 0;
                const savings = parseFloat(formData.savings) || 0;
                const hasJob = formData.hasJob === "yes";

                const lowIncome = gross > 0 && gross < 1500;
                const highExpenses = net > 0 && expenses >= net * 0.75;
                const noSavings = savings <= 50;
                const unemployed = !hasJob;

                // Show only if one or more red flags are true
                if (lowIncome || highExpenses || noSavings || unemployed) {
                    return (
                        <div className="food-alert">
                            <h4>🍎 Food Assistance Resources</h4>
                            <p>
                                Based on your responses, it seems your budget may leave limited room for food or essentials.
                                If you ever find yourself struggling to afford meals, these programs can help:
                            </p>
                            <ul>
                                <li>
                                    <a
                                        href="https://www.bmcc.cuny.edu/student-affairs/panther-pantry/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        🏫 BMCC Panther Pantry
                                    </a>{" "}
                                    — Free groceries and essential items for BMCC students.
                                </li>
                                <li>
                                    <a
                                        href="https://www.foodbanknyc.org/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        🥫 Food Bank for New York City
                                    </a>{" "}
                                    — Find nearby food pantries and soup kitchens across NYC.
                                </li>
                                <li>
                                    <a
                                        href="https://www.nyc.gov/site/doh/services/food-assistance.page"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        🗽 NYC Food Assistance Programs
                                    </a>{" "}
                                    — City programs that provide meals and grocery support.
                                </li>
                            </ul>
                            <p className="food-note">
                                💡 *You’re not alone — many students use these programs while working toward financial stability.*
                            </p>
                        </div>
                    );
                }
                return null;
            })()}

        </div>
    );
};

export default IntakeForm;
