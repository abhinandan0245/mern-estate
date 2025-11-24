import React from 'react'

export default function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      {/* form */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen bg-white">
        <form action="" className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label htmlFor="search" className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              name="searchTerm"
              id="searchTerm"
              placeholder="Search..."
              className="border p-2 rounded-lg w-full"
            />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <label htmlFor="type" className="whitespace-nowrap font-semibold">
              Type:
            </label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5" />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <label htmlFor="type" className="whitespace-nowrap font-semibold">
              Amenities:
            </label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="sort" className="font-semibold">
              sort:
            </label>
            <select
              name="sort_order"
              id="sort_order"
              className="ml-4 border p-2 rounded-lg"
            >
              <option value="">Price high to low</option>
              <option value="">Price low to high</option>
              <option value="">latest</option>
              <option value="">Oldest</option>
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
      </div>
    </div>
  );
}
