import React from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserShield,
  FaHome,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";

const MobileProfileDropdown = ({ user, onSignOut, onClose }) => {
  return (
    <div className="md:hidden bg-gradient-to-b from-indigo-700 to-purple-700 shadow-inner overflow-hidden">
      <ul className="flex flex-col p-4 space-y-4">
        {/* Admin Link (Only for Admins) */}
        {user?.role === "admin" && (
          <li>
            <Link
              to="/admin-dashboard"
              className="block text-white hover:text-amber-200 transition-colors py-3 font-medium transform hover:translate-x-2 duration-200 flex items-center gap-2 border-b border-indigo-600 pb-2"
              onClick={onClose}
            >
              <FaUserShield className="text-yellow-300" />
              Admin Dashboard
            </Link>
          </li>
        )}

        {/* Dashboard Link */}
        {user && (
          <li>
            <Link
              to="/dashboard"
              className="block text-white hover:text-amber-200 transition-colors py-3 font-medium transform hover:translate-x-2 duration-200 flex items-center gap-2 border-b border-indigo-600 pb-2"
              onClick={onClose}
            >
              <FaTachometerAlt />
              Dashboard
            </Link>
          </li>
        )}

        {/* Other Links */}
        <li>
          <Link
            to="/wishlist"
            className="block text-white hover:text-amber-200 transition-colors py-3 font-medium transform hover:translate-x-2 duration-200 flex items-center gap-2 border-b border-indigo-600 pb-2"
            onClick={onClose}
          >
            <FaHeart className="text-red-300" />
            Wishlist
          </Link>
        </li>

        {/* Profile Links if user is logged in */}
        {user ? (
          <>
            <li>
              <Link
                to="/profile"
                className="block text-white hover:text-amber-200 transition-colors py-3 font-medium transform hover:translate-x-2 duration-200 flex items-center gap-2"
                onClick={onClose}
              >
                <FaUser />
                My Profile
              </Link>
            </li>
            <li>
              <Link
                to="/my-listings"
                className="block text-white hover:text-amber-200 transition-colors py-3 font-medium transform hover:translate-x-2 duration-200 flex items-center gap-2"
                onClick={onClose}
              >
                <FaHome />
                My Listings
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="block w-full text-left text-red-300 hover:text-red-200 transition-colors py-3 font-medium transform hover:translate-x-2 duration-200 flex items-center gap-2 border-t border-indigo-600 pt-3"
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/sign-in"
              className="block text-white hover:text-amber-200 transition-colors py-3 font-medium transform hover:translate-x-2 duration-200 flex items-center gap-2 border-t border-indigo-600 pt-3"
              onClick={onClose}
            >
              Sign In
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MobileProfileDropdown;
