import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import {
  MapPin,
  Bed,
  Bath,
  Car,
  Home,
  Ruler,
  Calendar,
  User,
  Phone,
  Mail,
  Star,
  Shield,
  Clock,
  ArrowLeft,
  Tag,
} from "lucide-react";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useSelector } from "react-redux";
import { list } from "firebase/storage";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation, Pagination]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ContactLandlord, setContactLandlord] = useState(false);

  const params = useParams();

  const {currentUser} = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        console.log("Listing Data:", data);
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            This property might not exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Listings
          </Link>
        </div>
      </header>

      {/* Clean Image Gallery */}
      <section className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <Swiper
            navigation
            pagination={{ clickable: true }}
            className="h-64 md:h-96"
          >
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={url}>
                <img
                  src={url}
                  alt={`${listing.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/800x400/F3F4F6/6B7280?text=Property+Image+${
                      index + 1
                    }`;
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Property Details */}
      <section className="max-w-[70%] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Property Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Listed 2 days ago</span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listing.type === "rent"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  For {listing.type === "rent" ? "Rent" : "Sale"}
                </div>
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                {listing.name}
              </h1>

              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-base md:text-lg">{listing.address}</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl md:text-4xl font-bold text-gray-900">
                  {formatPrice(
                    listing.offer ? listing.discountPrice : listing.regularPrice
                  )}
                </span>
                {listing.offer && (
                  <>
                    <span className="text-xl line-through text-gray-500">
                      {formatPrice(listing.regularPrice)}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
                      Save{" "}
                      {formatPrice(
                        listing.regularPrice - listing.discountPrice
                      )}
                    </span>
                  </>
                )}
                <span className="text-gray-600 text-lg">
                  {listing.type === "rent" ? "/month" : "total"}
                </span>
              </div>
            </div>

            {/* Key Features */}
            <div className="border-t border-b border-gray-200 py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Bed className="w-7 h-7 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {listing.bedrooms}
                  </p>
                  <p className="text-gray-600">Bedrooms</p>
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Bath className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {listing.bathrooms}
                  </p>
                  <p className="text-gray-600">Bathrooms</p>
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Ruler className="w-7 h-7 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                  <p className="text-gray-600">Sq. Ft.</p>
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Car className="w-7 h-7 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {listing.parking ? "Yes" : "No"}
                  </p>
                  <p className="text-gray-600">Parking</p>
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Features</h3>
              <div className="flex flex-wrap gap-3">
                {listing.furnished && (
                  <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium border">
                    Fully Furnished
                  </span>
                )}
                {listing.parking && (
                  <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium border">
                    Parking Available
                  </span>
                )}
                {listing.offer && (
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium border">
                    Special Offer
                  </span>
                )}
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium border">
                  {listing.type === "rent"
                    ? "Available for Rent"
                    : "Available for Sale"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {listing.description}
              </p>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Location</h3>
              <div className="bg-gray-100 rounded-xl p-6">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-gray-600 mr-3 mt-0.5" />
                  <span className="text-gray-700 text-lg">
                    {listing.address}
                  </span>
                </div>
              </div>
            </div>

            {currentUser && listing.userRef !== currentUser._id &&  !ContactLandlord && (
                /* Contact Landlord */ 
                    <button onClick={() => setContactLandlord(true)} className="bg-slate-700 w-full text-white rounded-lg uppercase hover:opacity-95 p-3">Contact Landlord</button>
                
            )}
            {ContactLandlord && <Contact listing={listing}/>}
          </div>

         
        </div>
      </section>
    </main>
  );
}
