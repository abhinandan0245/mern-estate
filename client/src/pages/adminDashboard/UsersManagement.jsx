import React, { useEffect, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH ALL USERS
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        credentials: "include",
      });

      const data = await res.json();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ BLOCK / UNBLOCK
  const handleBlockToggle = async (id) => {
    try {
      await fetch(`/api/admin/users/${id}/block`, {
        method: "PATCH",
        credentials: "include",
      });

      fetchUsers(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      accessorKey: "avatar",
      header: "Avatar",
      Cell: ({ row }) => (
        <img
          src={row.original.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    { accessorKey: "username", header: "Username" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Role",
      Cell: ({ cell }) => (
        <span className="capitalize font-semibold">{cell.getValue()}</span>
      ),
    },
    {
      accessorKey: "isBlocked",
      header: "Status",
      Cell: ({ cell }) => (
        <span
          className={`font-semibold ${
            cell.getValue() ? "text-red-600" : "text-green-600"
          }`}
        >
          {cell.getValue() ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      Cell: ({ row }) => {
        const user = row.original;

        if (user.role === "admin") {
          return <span className="text-gray-400">—</span>;
        }

        return (
          <button
            onClick={() => handleBlockToggle(user._id)}
            className={`px-3 py-1 rounded text-sm font-medium ${
              user.isBlocked
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            {user.isBlocked ? "Unblock" : "Block"}
          </button>
        );
      },
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: users,
    enablePagination: true,
    initialState: { pagination: { pageSize: 8 } },
    state: { isLoading: loading },
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">All Users</h2>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <MantineReactTable table={table} />
        </div>
      </div>
    </div>
  );
}
