import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="flex items-baseline">
                <span className="font-bold text-2xl bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                  Prop
                </span>
                <span className="font-bold text-2xl bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent italic ml-1">
                  Zen
                </span>
              </div>
              <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full ml-1"></div>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Your trusted partner in finding the perfect property. We connect
              dreams with addresses, making real estate journeys seamless and
              successful.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-amber-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  All Listings
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-amber-400">
              Property Types
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  Apartments
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  Villas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  Office Spaces
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  Commercial
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  Plots
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-amber-400">
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt
                  className="text-amber-400 mt-1 flex-shrink-0"
                  size={16}
                />
                <p className="text-gray-300 text-sm">
                  123 Business Avenue
                  <br />
                  Suite 100, Downtown
                  <br />
                  City, State 12345
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-amber-400 flex-shrink-0" size={14} />
                <a
                  href="tel:+11234567890"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  +1 (123) 456-7890
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope
                  className="text-amber-400 flex-shrink-0"
                  size={14}
                />
                <a
                  href="mailto:info@propzen.com"
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  info@propzen.com
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-gray-200">
                Newsletter
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-amber-400 text-sm text-white placeholder-gray-400"
                />
                <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-4 py-2 rounded-r-lg text-white text-sm font-medium transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left mb-4 md:mb-0">
              © {new Date().getFullYear()} PropZen. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
