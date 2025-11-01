import React from "react";
import "./Dashboard.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import { Link } from "react-router-dom";


const Dashboard = () => {
    // Dummy chart data
    const data = {
        labels: ["Taxes", "Expenses", "Savings", "Remaining"],
        datasets: [
            {
                data: [420, 850, 300, 180],
                backgroundColor: ["#ef4444", "#3b82f6", "#22c55e", "#facc15"],
                hoverOffset: 8,
            },
        ],
    };

    return (
        <div className="dashboard">
            <h2>📊 Student Financial Dashboard</h2>
            <p className="subtitle">
                An overview of your current budget, goals, and AI insights.
            </p>

            <div className="dashboard-grid">
                {/* Chart Card */}
                <div className="dashboard-card chart-card">
                    <h3>Your Financial Breakdown</h3>
                    <div className="chart-wrapper">
                        <Pie
                            data={data}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false, // keep chart responsive within wrapper
                                plugins: {
                                    legend: { display: false },
                                    tooltip: { enabled: false },
                                },
                            }}
                        />
                    </div>

                    <ul className="chart-legend">
                        <li><span className="color taxes"></span>Taxes</li>
                        <li><span className="color expenses"></span>Expenses</li>
                        <li><span className="color savings"></span>Savings</li>
                        <li><span className="color remaining"></span>Remaining</li>
                    </ul>
                </div>


                {/* Summary Card */}
                <div className="dashboard-card">
                    <h3>Summary</h3>
                    <p><strong>Monthly Income:</strong> $1,750</p>
                    <p><strong>Expenses:</strong> $850</p>
                    <p><strong>Savings:</strong> $300</p>
                    <p><strong>Taxes:</strong> $420</p>
                    <p><strong>Remaining:</strong> $180</p>
                </div>

                {/* Goal Progress */}
                <div className="dashboard-card">
                    <h3>Goal Progress</h3>
                    <p>Save $1,000 Emergency Fund</p>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: "70%" }}></div>
                    </div>
                    <p className="goal-status">70% Complete</p>
                </div>

                {/* AI Insight */}
                <div className="dashboard-card">
                    <h3>Recent AI Tip</h3>
                    <p className="ai-tip">
                        “Automate your savings — even $25 a week adds up to $1,300 a year!
                        Consistency builds wealth over time.”
                    </p>
                </div>

                <div className="dashboard-card">
                    <h3>🍎 Food Security Indicator</h3>
                    <p>Based on your current budget, you may qualify for campus food assistance.</p>
                    <Link to="https://www.bmcc.cuny.edu/student-affairs/panther-pantry/" target="_blank">
                        Access BMCC Panther Pantry
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
