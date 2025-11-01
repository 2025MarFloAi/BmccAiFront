import React from "react";

const Step = ({ num, title, desc }) => (
    <div className="flex flex-col items-center">
        <div className="bg-blue-700 text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold mb-3">
            {num}
        </div>
        <h5 className="text-lg font-semibold text-blue-700 mb-2">{title}</h5>
        <p className="text-gray-600">{desc}</p>
    </div>
);

export default Step;
