// src/components/dashboard/StatCard.jsx
import React from "react";

export default function StatCard({
  title,
  value,
  delta,
  icon,
  description,
  color = "indigo",
  loading = false,
  onClick,
}) {
  const colorClasses = {
    indigo: {
      bg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      iconColor: "text-white",
      text: "text-indigo-700",
      border: "border-indigo-100",
      deltaBg: "bg-indigo-50 text-indigo-700",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconColor: "text-white",
      text: "text-blue-700",
      border: "border-blue-100",
      deltaBg: "bg-blue-50 text-blue-700",
    },
    green: {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      iconColor: "text-white",
      text: "text-emerald-700",
      border: "border-emerald-100",
      deltaBg: "bg-emerald-50 text-emerald-700",
    },
    amber: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100",
      iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
      iconColor: "text-white",
      text: "text-amber-700",
      border: "border-amber-100",
      deltaBg: "bg-amber-50 text-amber-700",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      iconColor: "text-white",
      text: "text-purple-700",
      border: "border-purple-100",
      deltaBg: "bg-purple-50 text-purple-700",
    },
    rose: {
      bg: "bg-gradient-to-br from-rose-50 to-rose-100",
      iconBg: "bg-gradient-to-br from-rose-500 to-rose-600",
      iconColor: "text-white",
      text: "text-rose-700",
      border: "border-rose-100",
      deltaBg: "bg-rose-50 text-rose-700",
    },
  };

  const currentColor = colorClasses[color] || colorClasses.indigo;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (loading) {
    return (
      <div
        className={`${currentColor.bg} rounded-xl border ${currentColor.border} p-5 animate-pulse`}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`${currentColor.bg} rounded-xl border ${
        currentColor.border
      } p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 cursor-pointer group ${
        onClick ? "active:scale-[0.98]" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {title}
            </span>

            {delta !== undefined && delta !== null && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${currentColor.deltaBg}`}
              >
                {delta >= 0 ? (
                  <span className="flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {delta}%
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {Math.abs(delta)}%
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-gray-900">
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {delta !== undefined && delta !== null && delta !== 0 && (
              <span
                className={`text-sm font-semibold ${
                  delta >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {delta > 0 ? "↗" : "↘"}
              </span>
            )}
          </div>

          {description && (
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          )}
        </div>

        <div
          className={`${currentColor.iconBg} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          {icon ? (
            <div className={`w-6 h-6 ${currentColor.iconColor}`}>{icon}</div>
          ) : (
            <svg
              className={`w-6 h-6 ${currentColor.iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Progress bar for delta */}
      {delta !== undefined && delta !== null && (
        <div className="mt-4">
          <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                delta >= 0 ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min(Math.abs(delta), 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
