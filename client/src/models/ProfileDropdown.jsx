import React, { useRef, useEffect } from "react";
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
  FaUsers,
  FaListAlt,
  FaAlignRight,
  FaCheckCircle,
} from "react-icons/fa";
import { RiHomeHeartFill } from "react-icons/ri";

const ProfileDropdown = ({
  user,
  isOpen,
  onClose,
  onSignOut,
  dropdownRef,
  className = "",
  align = "right",
}) => {
  const internalRef = useRef(null);
  const ref = dropdownRef || internalRef;

  // Close on click outside - FIXED VERSION
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the dropdown
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      // Use setTimeout to avoid immediate trigger
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, ref]);

  if (!isOpen || !user || user.role === "buyer") return null;


  const alignmentClasses = {
    right: "right-0",
    left: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
  };

  const isAdmin = user.role === "admin";

  const roleLabel =
    user.role === "admin"
      ? "👑 Admini"
      : user.role === "user"
      ? "🏷️ Seller"
      : "🛒 Buyer";


  return (
    <div
      ref={ref}
      className={`absolute mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden ${alignmentClasses[align]} ${className}`}
    >
      {/* User Info Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
          />
          <div>
            <p className="font-semibold text-gray-800 truncate">
              {user.username}
            </p>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
            {/* <span
              className={`text-xs px-2 py-1 rounded-full font-medium mt-1 inline-block ${
                isAdmin
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  : "bg-indigo-100 text-indigo-800 border border-indigo-300"
              }`}
            >
              {isAdmin ? "👑 Administrator" : "👤 User"}
            </span> */}
            {roleLabel}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {/* Dashboard Link */}
        <Link
          to={isAdmin ? "/dashboard/admin" : "/dashboard"}
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
          onClick={onClose}
        >
          <FaTachometerAlt
            className={isAdmin ? "text-yellow-500" : "text-gray-500"}
          />
          <span>{isAdmin ? "Admin Dashboard" : "Dashboard"}</span>
        </Link>

        {/* For Admin - Show minimal options */}
        {isAdmin ? (
          <>
            {/* Profile Link for Admin */}
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 border-t border-gray-100"
              onClick={onClose}
            >
              <FaUser className="text-gray-500" />
              <span>Profile</span>
            </Link>
            {/* Users Link for Admin */}
            <Link
              to="/dashboard/admin/users"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 border-t border-gray-100"
              onClick={onClose}
            >
              <FaUsers className="text-gray-500" />
              <span>Manage Users</span>
            </Link>
            {/* Listings Link for Admin */}
            <Link
              to="/dashboard/admin/properties"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 border-t border-gray-100"
              onClick={onClose}
            >
              <FaListAlt className="text-gray-500" />
              <span>Manage Listings</span>
            </Link>
            {/* Approvals Link for Admin */}
            <Link
              to="/dashboard/admin/approvals"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 border-t border-gray-100"
              onClick={onClose}
            >
              <FaCheckCircle className="text-gray-500" />
              <span>Manage Approvals</span>
            </Link>

            {/* Sign Out for Admin */}
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 border-t border-gray-100"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          /* For Regular Users - Show all options */
          <>
            {/* Common Links for Users */}
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 border-t border-gray-100"
              onClick={onClose}
            >
              <FaUser className="text-gray-500" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/create-listing"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
              onClick={onClose}
            >
              <FaHome className="text-gray-500" />
              <span>Add Listings</span>
            </Link>
            <Link
              to="/dashboard/my-listings"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
              onClick={onClose}
            >
              <RiHomeHeartFill className="text-gray-500" />
              <span>My Listings</span>
            </Link>

            {/* <Link
              to="/messages"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
              onClick={onClose}
            >
              <FaEnvelope className="text-gray-500" />
              <span>Messages</span>
            </Link> */}

            {/* <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
              onClick={onClose}
            >
              <FaCog className="text-gray-500" />
              <span>Settings</span>
            </Link> */}

            {/* Sign Out for Users */}
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 border-t border-gray-100"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;
