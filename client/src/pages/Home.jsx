import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import Swiper from 'swiper';
import { SwiperSlide, Swiper } from "swiper/react";
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';

import SwiperCore from 'swiper';
import ListingCard from '../components/ListingCard';


export default function Home() {
  SwiperCore.use([Navigation]);
  const [offeredListings, setOfferedListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  console.log("offeredListings", offeredListings);

  useEffect(() => {
    const fetchOfferedListings = async () => {
      try {
        const res = await fetch(
          "/api/listing/get?offer=true&sort=createdAt&order=desc&limit=4"
        );

        const data = await res.json();
        setOfferedListings(data);
      } catch (error) { 
        console.error("Error fetching offered listings:", error);
      }
        
      

    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          "/api/listing/get?type=rent&sort=createdAt&order=desc&limit=4"
        );

        const data = await res.json();
        setRentListings(data);
      }
      catch (error) {
        console.error("Error fetching rent listings:", error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(
          "/api/listing/get?type=sale&sort=createdAt&order=desc&limit=4"
        );

        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error("Error fetching sale listings:", error);
      }
    };
    fetchOfferedListings();
    fetchRentListings();
    fetchSaleListings();
  }, []);

  return (
    <div>
      {/* top  */}
      <div className="flex flex-col gap-6 px-4 md:px-8 lg:px-16 py-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Find Your next <span className="">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-lg text-slate-600">
          propzen Estate is tthe best place to find your dream home. <br /> With
          a wide range of properties, user-friendly interface, and advanced
          search features, <br /> we make it easy for you to find the perfect
          property that meets your needs and budget.
        </div>
        <Link to={"/search"} className="">
          let's get started...
        </Link>
      </div>

      {/* swiper  */}

      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="mySwiper h-[500px] mb-12"
      >
        {/* Swiper slides go here */}
        {offeredListings &&
          offeredListings.length > 0 &&
          offeredListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center center / cover no-repeat`,
                }}
                className="relative w-full h-[500px] rounded-lg overflow-hidden group cursor-pointer"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer , sale and rent */}

      <div>
        {offeredListings && offeredListings.length > 0 && (
          <>
            <div className="mb-5 px-4 md:px-8 lg:px-16">
              <h2 className="text-2xl font-semibold mb-2">Special Offers</h2>
              <Link to={"/search?offer=true"}>Show more offer</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-8 lg:px-16 mb-12">
              {offeredListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </>
        )}
        {rentListings && rentListings.length > 0 && (
          <>
            <div className="mb-5 px-4 md:px-8 lg:px-16">
              <h2 className="text-2xl font-semibold mb-2">Places for Rent</h2>
              <Link to={"/search?type=rent"}>Show more places for rent</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-8 lg:px-16 mb-12">
              {rentListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </>
        )}
        {saleListings && saleListings.length > 0 && (
          <>
            <div className="mb-5 px-4 md:px-8 lg:px-16">  
              <h2 className="text-2xl font-semibold mb-2">Places for Sale</h2>
              <Link to={"/search?type=sale"}>Show more places for sale</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-8 lg:px-16 mb-12">
              {saleListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </>
        )}

            
      </div>
    </div>
  );
}
