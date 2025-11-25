import React from "react";
import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  const getPriceDisplay = () => {
    const price = listing.offer ? listing.discountPrice : listing.regularPrice;
    const formattedPrice = `₹${formatPrice(price)}`;

    if (listing.type === "rent") {
      return `${formattedPrice} / month`;
    }

    if (listing.offer) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-green-700">
            {formattedPrice}
          </span>
          <span className="text-sm text-slate-400 line-through">
            ₹{formatPrice(listing.regularPrice)}
          </span>
        </div>
      );
    }

    return (
      <span className="text-xl font-bold text-slate-800">{formattedPrice}</span>
    );
  };

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="
        group block overflow-hidden rounded-xl bg-white 
        border border-slate-200 hover:border-slate-300
        shadow-sm hover:shadow-xl transition-all duration-300
        hover:-translate-y-1 cursor-pointer
      "
    >
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="
            h-full w-full object-cover transition-all duration-700
            group-hover:scale-110 group-hover:brightness-110
          "
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
          {listing.offer && (
            <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              SPECIAL OFFER
            </span>
          )}
          {listing.type === "rent" && (
            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              FOR RENT
            </span>
          )}
          {listing.type === "sale" && (
            <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              FOR SALE
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          className="
            absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
            flex items-center justify-center shadow-md hover:bg-white
            transition-all duration-200 hover:scale-110 hover:shadow-lg
            border border-white/20
          "
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Add to favorites logic here
          }}
        >
          <svg
            className="w-4 h-4 text-slate-600 hover:text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        {/* Price - Now at the top */}
        <div className="flex items-center justify-between">
          {getPriceDisplay()}
          {listing.offer && listing.type === "sale" && (
            <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
              SAVE ₹{formatPrice(listing.regularPrice - listing.discountPrice)}
            </span>
          )}
        </div>

        {/* Title and Address */}
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 line-clamp-2 leading-tight">
            {listing.name}
          </h2>
          <p className="text-sm text-slate-500 line-clamp-1 flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {listing.address}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100">
          <div className="flex flex-col items-center text-center">
            <svg
              className="w-5 h-5 text-slate-400 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-sm font-semibold text-slate-700">
              {listing.bedrooms}
            </span>
            <span className="text-xs text-slate-500">Beds</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <svg
              className="w-5 h-5 text-slate-400 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-semibold text-slate-700">
              {listing.bathrooms}
            </span>
            <span className="text-xs text-slate-500">Baths</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <svg
              className="w-5 h-5 text-slate-400 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="text-sm font-semibold text-slate-700 capitalize">
              {listing.furnished ? "Yes" : "No"}
            </span>
            <span className="text-xs text-slate-500">Furnished</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Updated recently
          </span>
          <span className="font-medium text-slate-600">View Details →</span>
        </div>
      </div>
    </Link>
  );
}
