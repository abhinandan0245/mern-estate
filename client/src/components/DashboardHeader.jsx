import React from "react";

export default function DashboardHeader({ title, actionLabel, onAction }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
