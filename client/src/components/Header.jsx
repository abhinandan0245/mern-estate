import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  console.log("Current User in Header:", currentUser);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto p-3 overflow-visible">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">PropZen</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form className="flex items-center bg-slate-100 px-3 py-2 rounded-lg w-full sm:w-auto sm:flex-1 mx-4 sm:mx-8">
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow bg-transparent focus:outline-none text-sm sm:text-base"
          />
          <FaSearch className="text-slate-600" />
        </form>

        {/* Navigation */}
        <ul className="flex items-center gap-4 flex-shrink-0">
          <li>
            <Link
              to="/"
              className="hidden sm:inline text-slate-700 hover:underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="hidden sm:inline text-slate-700 hover:underline"
            >
              About
            </Link>
          </li>
          <li>
            <Link to="/profile">
              {currentUser ? (
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-400 shadow-md hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-slate-700 hover:underline">Sign In</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
