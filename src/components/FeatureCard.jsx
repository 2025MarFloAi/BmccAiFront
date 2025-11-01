import React from "react";

const FeatureCard = ({ title, text }) => (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
        <h4 className="text-xl font-semibold text-blue-700 mb-3">{title}</h4>
        <p className="text-gray-600">{text}</p>
    </div>
);

export default FeatureCard;
