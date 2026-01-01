import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../../pages/dashboard/StatCard";
import { FaUsers, FaHome, FaClock, FaCheckCircle, FaArrowRight } from "react-icons/fa";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    pendingListings: 0,
    approvedListings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch admin stats");
        }

        const data = await res.json();
        if (mounted) setStats(data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err.message);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-red-800 font-medium">Error Loading Stats</h3>
            </div>
            <p className="text-red-600 mt-1 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of platform statistics</p>
      </div>

      {/* Stats Cards with Links */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Link to="/dashboard/admin/users" className="block">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            color="blue"
            icon={<FaUsers className="w-5 h-5" />}
          />
        </Link>

        <Link to="/dashboard/admin/properties" className="block">
          <StatCard
            title="Total Listings"
            value={stats.totalListings.toLocaleString()}
            color="purple"
            icon={<FaHome className="w-5 h-5" />}
          />
        </Link>

        <Link to="/dashboard/admin/approvals" className="block">
          <StatCard
            title="Pending Listings"
            value={stats.pendingListings.toLocaleString()}
            color="amber"
            icon={<FaClock className="w-5 h-5" />}
          />
        </Link>

        <Link to="/dashboard/admin/properties?status=approved" className="block">
          <StatCard
            title="Approved Listings"
            value={stats.approvedListings.toLocaleString()}
            color="green"
            icon={<FaCheckCircle className="w-5 h-5" />}
          />
        </Link>
      </div>

      {/* Quick Links Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Link
            to="/dashboard/admin/users"
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                  <FaUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">User Management</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage all users</p>
                </div>
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            to="/dashboard/admin/properties"
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-500 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                  <FaHome className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Properties</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage all listings</p>
                </div>
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link
            to="/dashboard/admin/approvals"
            className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-500 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mr-4">
                  <FaClock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {stats.pendingListings} listings need review
                  </p>
                </div>
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-5 border border-indigo-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-indigo-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-medium text-gray-900">Platform Summary</h3>
              <p className="text-sm text-gray-600">
                {stats.totalListings > 0 ? (
                  <>
                    <span className="font-semibold text-green-600">
                      {((stats.approvedListings / stats.totalListings) * 100).toFixed(1)}%
                    </span>{" "}
                    of listings are approved •{" "}
                    <span className="font-semibold text-amber-600">
                      {stats.pendingListings}
                    </span>{" "}
                    pending approvals
                  </>
                ) : (
                  "No listings yet"
                )}
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/admin/properties"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            View Details
            <FaArrowRight className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}