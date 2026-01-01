import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import Footer from "./components/Footer";

/* Dashboard layouts/pages */
import AdminLayout from "./pages/adminDashboard/AdminLayout";
import AdminHome from "./pages/adminDashboard/AdminHome";
import Approvals from "./pages/adminDashboard/Approvals";
import AllProperties from "./pages/adminDashboard/AllProperties";
import UsersManagement from "./pages/adminDashboard/UsersManagement";

import UserLayout from "./pages/userDashboard/UserLayout";
import UserHome from "./pages/userDashboard/UserHome";
import MyListings from "./pages/userDashboard/UserListingsTable";
import Favorites from "./pages/userDashboard/Favorites";
import Messages from "./pages/userDashboard/Messages";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import UserListingsTable from "./pages/userDashboard/UserListingsTable";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />

        {/* User Dashboard (protected) */}
        <Route element={<PrivateRoute />}>
          {/* User Dashboard */}
          <Route path="/dashboard/user" element={<UserDashboard />} />

          {/* Admin Dashboard */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          {/* user layout at /dashboard */}
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<UserHome />} />
            <Route path="/dashboard/my-listings" element={<UserListingsTable />} />
            <Route path="/dashboard/favorites" element={<Favorites />} />
            <Route path="/dashboard/messages" element={<Messages />} />
          </Route>

          {/* existing protected pages (create/update listings/profile) */}
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Dashboard (protected by admin role) */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard/admin" element={<AdminHome />} />
            <Route path="/dashboard/admin/approvals" element={<Approvals />} />
            <Route
              path="/dashboard/admin/properties"
              element={<AllProperties />}
            />
            <Route
              path="/dashboard/admin/users"
              element={<UsersManagement />}
            />
          </Route>
        </Route>

        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
