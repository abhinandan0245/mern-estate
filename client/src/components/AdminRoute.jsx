// src/components/AdminRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user); // adjust selector if your store shape different
  // If not logged in or not admin => redirect
  if (!currentUser) return <Navigate to="/sign-in" replace />;
  return currentUser.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}
