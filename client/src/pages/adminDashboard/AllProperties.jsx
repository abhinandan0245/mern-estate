import React, { useEffect, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

export default function Properties() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all listings (ADMIN)
  const fetchListings = async () => {
    try {
      const res = await fetch("/api/admin/listings", {
        credentials: "include",
      });

      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const columns = [
    {
      accessorKey: "imageUrls",
      header: "Image",
      Cell: ({ row }) => (
        <img
          src={row.original.imageUrls[0]}
          alt="property"
          className="w-14 h-14 rounded object-cover"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Property",
    },
    {
      accessorKey: "address",
      header: "Address",
      Cell: ({ cell }) => (
        <span className="text-gray-600 text-sm">
          {cell.getValue().slice(0, 30)}...
        </span>
      ),
    },
    {
      accessorKey: "regularPrice",
      header: "Price",
      Cell: ({ cell }) => `₹${cell.getValue()}`,
    },
    {
      accessorKey: "type",
      header: "Type",
      Cell: ({ cell }) => <span className="capitalize">{cell.getValue()}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => (
        <span
          className={`font-semibold capitalize ${
            cell.getValue() === "approved"
              ? "text-green-600"
              : cell.getValue() === "rejected"
              ? "text-red-600"
              : "text-orange-600"
          }`}
        >
          {cell.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "userRef.username",
      header: "Owner",
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: listings,
    enablePagination: true,
    initialState: { pagination: { pageSize: 8 } },
    state: { isLoading: loading },
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">
        All Properties ({listings.length})
      </h1>

      {/* Responsive wrapper */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <MantineReactTable table={table} />
        </div>
      </div>
    </div>
  );
}
