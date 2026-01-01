import React, { useEffect, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Button } from "@mantine/core";

export default function Approvals() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch pending listings
  const fetchPendingListings = async () => {
    try {
      const res = await fetch("/api/admin/listings/pending", {
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
    fetchPendingListings();
  }, []);

  // 🔹 Approve listing
  const handleApprove = async (id) => {
    try {
      await fetch(`/api/admin/listings/${id}/approve`, {
        method: "PUT",
        credentials: "include",
      });
      fetchPendingListings(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Reject listing
  const handleReject = async (id) => {
    try {
      await fetch(`/api/admin/listings/${id}/reject`, {
        method: "PUT",
        credentials: "include",
      });
      fetchPendingListings(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      accessorKey: "imageUrls",
      header: "Image",
      Cell: ({ row }) => (
        <img
          src={row.original.imageUrls[0]}
          alt="listing"
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
        <span className="text-sm text-gray-600">
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
      id: "actions",
      header: "Actions",
      enableSorting: false,
      Cell: ({ row }) => (
        <div className="flex gap-3 whitespace-nowrap">
          <Button
            color="green"
            // variant="light"
            size="xs"
            onClick={() => handleApprove(row.original._id)}
            className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 text-sm font-medium"
          >
            Approve
          </Button>

          <Button
            color="red"
            variant="outline"
            size="xs"
            onClick={() => handleReject(row.original._id)}
            className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium"
          >
            Reject
          </Button>
        </div>
      ),
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
        Pending Approvals ({listings.length})
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
