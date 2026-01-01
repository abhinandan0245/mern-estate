import React from "react";
import { Outlet } from "react-router-dom";
// import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* <DashboardSidebar variant="admin" /> */}
      <div className="flex-1 p-6">
        <DashboardHeader title="Admin Panel" />
        <main className="mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
