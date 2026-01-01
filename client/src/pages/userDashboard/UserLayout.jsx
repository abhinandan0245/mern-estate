import React from "react";
import { Outlet } from "react-router-dom";
// import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* <DashboardSidebar variant="user" /> */}
      <div className="flex-1 p-6">
        <DashboardHeader title="Dashboard" />
        <main className="mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
