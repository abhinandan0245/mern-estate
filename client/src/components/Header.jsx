import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaHeart, FaBars, FaTimes, FaUserShield } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signoutUserSuccess } from "../redux/user/userSlice";
import ProfileDropdown from "../models/ProfileDropdown";
import MobileProfileDropdown from "../models/MobileProfileDropdown";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  console.log("Current User in Header:", currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signoutUserSuccess());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-4">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center">
          <button
            className="md:hidden text-white mr-3 focus:outline-none transition-transform duration-300 hover:scale-110"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          <Link to="/" className="flex items-center group">
            <div className="flex items-baseline">
              <span className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
                Prop
              </span>
              <span className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent drop-shadow-sm italic ml-1">
                Zen
              </span>
            </div>
            <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full ml-1 group-hover:scale-125 transition-transform duration-300"></div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full flex-1 max-w-lg mx-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <input
            type="text"
            placeholder="Search properties..."
            className="flex-grow bg-transparent focus:outline-none text-gray-800 text-sm placeholder-gray-500"
          />
          <button
            type="submit"
            className="text-indigo-600 hover:text-indigo-800 transition-colors transform hover:scale-110 duration-200"
          >
            <FaSearch />
          </button>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6">
          <li>
            <Link
              to="/"
              className="text-white hover:text-amber-200 transition-colors font-medium transform hover:scale-105 duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/search"
              className="text-white hover:text-amber-200 transition-colors font-medium transform hover:scale-105 duration-200"
            >
              All Listings
            </Link>
          </li>

          {/* Admin Link (Only for Admins) */}
          {currentUser?.role === "admin" && (
            <li>
              <Link
                to="/admin-dashboard"
                className="text-white hover:text-amber-200 transition-colors font-medium flex items-center gap-1 transform hover:scale-105 duration-200"
              >
                <FaUserShield className="text-yellow-300" />
                <span>Admin</span>
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/wishlist"
              className="text-white hover:text-amber-200 transition-colors flex items-center gap-1 transform hover:scale-105 duration-200 group"
            >
              <FaHeart className="text-red-300 group-hover:text-red-400 transition-colors duration-200" />
              <span className="font-medium">Wishlist</span>
            </Link>
          </li>

          {/* Profile Dropdown Trigger */}
          <li className="relative" ref={dropdownRef}>
            {currentUser ? (
              currentUser.role === "buyer" ? (
                // ✅ BUYER → Direct profile navigation (NO dropdown)
                <Link to="/profile" className="flex items-center gap-2 group">
                  <img
                    src={currentUser.avatar}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 group-hover:border-amber-300 transition-all duration-300"
                  />
                  <span className="text-white font-medium hidden lg:inline group-hover:text-amber-200 transition-colors duration-200">
                    {currentUser.username}
                  </span>
                </Link>
              ) : (
                // ✅ ADMIN / USER → Dropdown
                <>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-2 group focus:outline-none"
                  >
                    <img
                      src={currentUser.avatar}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 group-hover:border-amber-300 transition-all duration-300"
                    />
                    <span className="text-white font-medium hidden lg:inline group-hover:text-amber-200 transition-colors duration-200">
                      {currentUser.username}
                    </span>
                    <svg
                      className={`w-4 h-4 text-white transition-transform duration-200 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <ProfileDropdown
                    user={currentUser}
                    isOpen={isProfileDropdownOpen}
                    onClose={closeProfileDropdown}
                    onSignOut={handleSignOut}
                    dropdownRef={dropdownRef}
                  />
                </>
              )
            ) : (
              <Link
                to="/sign-in"
                className="text-white bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 rounded-full font-medium"
              >
                Sign In
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile Search and Profile */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            to="/search"
            className="text-white hover:text-amber-200 transition-colors duration-200 transform hover:scale-110"
          >
            <FaSearch size={18} />
          </Link>

          <Link
            to="/wishlist"
            className="text-white hover:text-red-300 transition-colors duration-200 transform hover:scale-110"
          >
            <FaHeart size={18} />
          </Link>

          {/* Mobile Profile Icon with Badge for Admin */}
          {currentUser ? (
            currentUser.role === "buyer" ? (
              <Link to="/profile">
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
              </Link>
            ) : (
              <Link to="/dashboard">
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
              </Link>
            )
          ) : (
            <Link to="/sign-in">Sign In</Link>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div
        className={`md:hidden bg-white border-t border-indigo-400 overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "max-h-20 opacity-100 p-4" : "max-h-0 opacity-0 p-0"
        }`}
      >
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
          <input
            type="text"
            placeholder="Search properties..."
            className="flex-grow bg-transparent focus:outline-none text-gray-800 text-sm"
          />
          <button
            type="submit"
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Mobile Profile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <MobileProfileDropdown
          user={currentUser}
          onSignOut={handleSignOut}
          onClose={closeMobileMenu}
        />
      </div>
    </header>
  );
}
