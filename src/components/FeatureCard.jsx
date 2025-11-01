import React from "react";
import "./FutureCard.css"

const FeatureCard = ({ title, text }) => (
    <div
        className="feature-card clickable"
        onClick={() => navigate("/intake")}
    >
        <h4>AI Budgeting Tool</h4>
        <p>
            Get a personalized example budget that fits your student lifestyle and financial goals.
        </p>
    </div>
);

export default FeatureCard;
