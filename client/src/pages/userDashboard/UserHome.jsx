import React from "react";
import { useSelector } from "react-redux";
import StatCard from "../../pages/dashboard/StatCard";

export default function UserHome() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Welcome, {currentUser.username}
      </h1>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        <StatCard title="My Listings" value={0} icon="🏠" color="blue" />
        <StatCard title="Favorites" value={0} icon="❤️" color="red" />
        <StatCard title="Messages" value={0} icon="💬" color="green" />
      </div>
    </div>
  );
}
