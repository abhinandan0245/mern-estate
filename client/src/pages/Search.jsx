import { List } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

export default function Search() {
    const naviagate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: "",
        type: "all",        
        parking: false,
        furnished: false,     
        offer: false,  
        sort:'created_at',
        order: "desc",
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    console.log("listings", listings);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFormUrl = urlParams.get("searchTerm") || "";
        const typeFormUrl = urlParams.get("type") || "all";
        const parkingFormUrl = urlParams.get("parking") === "true";
        const furnishedFormUrl = urlParams.get("furnished") === "true";
        const offerFormUrl = urlParams.get("offer") === "true";
        const sortFormUrl = urlParams.get("sort") || "created_at";
        const orderFormUrl = urlParams.get("order") || "desc";

        if(searchTermFormUrl || typeFormUrl || parkingFormUrl || furnishedFormUrl || offerFormUrl || sortFormUrl || orderFormUrl){
            setSidebardata({
                searchTerm: searchTermFormUrl,
                type: typeFormUrl,        
                parking: parkingFormUrl,
                furnished: furnishedFormUrl,     
                offer: offerFormUrl,  
                sort: sortFormUrl,
                order: orderFormUrl,
            });
        }

       const fetchListings = async () => {
        setLoading(true);
        const queryParams = new URLSearchParams();
        const res = await fetch(`/api/listing/get?${queryParams}`);
        const data = await res.json();
        setListings(data);
        setLoading(false);
       }
         fetchListings();

    }, [location.search]);

    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
            setSidebardata({
                ...sidebardata,
                type: e.target.id,
            });
        }

        if(e.target.id === 'searchTerm'){
            setSidebardata({
                ...sidebardata,
                searchTerm: e.target.value,
            });
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSidebardata({
                ...sidebardata,
                [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
            });
        }
        if(e.target.id === 'sort_order'){
            const [sort, order] = e.target.value.split("_");
            setSidebardata({
                ...sidebardata,
                sort: sort,
                order: order,
            });
        }           
    }


    const handleSubmit = (e) => {
      e.preventDefault();
    //   console.log("Searching with data:", sidebardata);
      // Implement search logic here, e.g., fetch listings based on sidebardata
      // single-values → always use set()
      const urlParams = new URLSearchParams();
      urlParams.set("searchTerm", sidebardata.searchTerm);
      urlParams.set("type", sidebardata.type);
      urlParams.set("parking", sidebardata.parking);
      urlParams.set("furnished", sidebardata.furnished);
      urlParams.set("offer", sidebardata.offer);
      urlParams.set("sort", sidebardata.sort);
      urlParams.set("order", sidebardata.order);
      const queryString = urlParams.toString();
      console.log("Query String:", queryString);
      naviagate(`/search?${queryString}`);
    }

  return (
    <div className="flex flex-col md:flex-row">
      {/* form */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label htmlFor="search" className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              name="searchTerm"
              id="searchTerm"
              vhalue={sidebardata.searchTerm}
              onChange={handleChange}
              placeholder="Search..."
              className="border p-2 rounded-lg w-full"
            />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <label htmlFor="type" className="whitespace-nowrap font-semibold">
              Type:
            </label>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebardata.type === "all"}
                type="checkbox"
                id="all"
                className="w-5"
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebardata.offer}
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <label htmlFor="type" className="whitespace-nowrap font-semibold">
              Amenities:
            </label>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebardata.parking}
                type="checkbox"
                id="parking"
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebardata.furnished}
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="sort" className="font-semibold">
              sort:
            </label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              name="sort_order"
              id="sort_order"
              className="ml-4 border p-2 rounded-lg"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      {/* listings cards */}
      <div className="mt-6 md:m-0 bg-zinc-200 flex-1">
        <h1 className="text-3xl font-semibold border-b p-3">
          Listing results{" "}
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
            {!loading && listings.length === 0 && (  
                <p className="text-center mt-6 text-gray-600">No listings found.</p>
            )}
            {loading && (  
                <p className="text-center mt-6 text-gray-600">Loading...</p>
            )}
            {!loading && listings.length > 0 && listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
            ))}

                  
        </div>
      </div>
    </div>
  );
}
