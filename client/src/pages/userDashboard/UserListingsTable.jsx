import React, { useEffect, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";

export default function UserListingsTable({ onDelete, onApprove }) {
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // API fetch inside this component
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.success === false) return;

        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchListings();
    }
  }, [currentUser]);

  const confirmDelete = (listingId) => {
    modals.openConfirmModal({
      title: "Delete listing?",
      centered: true,
      children: (
        <p className="text-sm text-gray-600">
          This action is irreversible. The listing will be permanently deleted.
        </p>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => onDelete(listingId),
    });
  };


  const columns = [
    {
      accessorKey: "imageUrls",
      header: "Image",
      Cell: ({ row }) => (
        <img
          src={row.original.imageUrls[0]}
          alt="listing"
          className="w-14 h-14 rounded object-cover border"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Property",
    },
    {
      accessorKey: "description",
      header: "Description",
      Cell: ({ row }) => (
        <span className="text-gray-600 hidden md:inline">
          {row.original.description.slice(0, 40)}...
        </span>
      ),
    },
    {
      accessorKey: "regularPrice",
      header: "Price",
      Cell: ({ cell }) => `₹${cell.getValue()}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }) => (
        <span
          className={`capitalize font-semibold ${
            row.original.status === "approved"
              ? "text-green-600"
              : "text-orange-600"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      Cell: ({ row }) => (
        <div className="flex gap-3 whitespace-nowrap">
          <Link
            to={`/listing/${row.original._id}`}
            className="text-blue-600 btn hover:underline"
          >
            View
          </Link>

          <Link
            to={`/update-listing/${row.original._id}`}
            className="text-yellow-600 hover:underline"
          >
            Edit
          </Link>

          <Button
            variant="outline"
            color="red"
            size="xs"
            loading={loading}
            onClick={() => confirmDelete(row.original._id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: listings,
    enablePagination: true,
    enableSorting: true,

    layoutMode: "grid", // ✅ important for responsiveness

    mantineTableContainerProps: {
      sx: {
        overflowX: "auto",
      },
    },

    initialState: {
      pagination: { pageSize: 5 },
    },

    state: {
      isLoading: loading,
    },
  });


  if (loading) {
    return <div className="mt-6 text-center">Loading listings...</div>;
  }

  return (
    <div className="mt-6 bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">
        My Listings ({listings.length})
      </h2>

      {/* Responsive Scroll Wrapper */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <MantineReactTable table={table} />
        </div>
      </div>
    </div>
  );
}