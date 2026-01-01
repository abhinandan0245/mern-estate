// import React from "react";
// import { NavLink } from "react-router-dom";

// export default function DashboardSidebar({ variant = "user" }) {
//   return (
//     <aside className="w-64 bg-white border-r p-4">
//       <h3 className="font-bold mb-4">
//         {variant === "admin" ? "Admin" : "My"} Panel
//       </h3>

//       <nav className="flex flex-col space-y-2">
//         {variant === "admin" ? (
//           <>
//             <NavLink
//               to="/dashboard/admin"
//               end
//               className="px-3 py-2 rounded hover:bg-gray-100"
//             >
//               Overview
//             </NavLink>
//             <NavLink
//               to="/dashboard/admin/approvals"
//               className="px-3 py-2 rounded hover:bg-gray-100"
//             >
//               Approvals
//             </NavLink>
//             <NavLink
//               to="/dashboard/admin/properties"
//               className="px-3 py-2 rounded hover:bg-gray-100"
//             >
//               All Properties
//             </NavLink>
//             <NavLink
//               to="/dashboard/admin/users"
//               className="px-3 py-2 rounded hover:bg-gray-100"
//             >
//               Users
//             </NavLink>
//           </>
//         ) : (
//           <>
//             <NavLink
//               to="/dashboard"
//               end
//               className="px-3 py-2 rounded hover:bg-gray-100"
//             >
//               Overview
//             </NavLink>
//             <NavLink
//               to="/dashboard/my-listings"
//               className="px-3 py-2 rounded hover:bg-gray-100"
//             >
//               My Listings
//             </NavLink>
//             <NavLink
//               to="/create-listing"
//               className="px-3 py-2 rounded hover:bg-gray-100"
//             >
//               Add Property
//             </NavLink>
//             <NavLink
//               to="/dashboard/favorites"
//               className="px-3 py-2 rounded hover:bg-gray-100"
//             >
//               Favorites
//             </NavLink>
//             <NavLink
//               to="/dashboard/messages"
//               className="px-3 py-2 rounded hover:bg-gray-100"
//             >
//               Messages
//             </NavLink>
//             <NavLink
//               to="/profile"
//               className="px-3 py-2 rounded hover:bg-gray-100"
//             >
//               Profile
//             </NavLink>
//           </>
//         )}
//       </nav>
//     </aside>
//   );
// }

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DashboardSidebar() {
  const { currentUser } = useSelector((state) => state.user);

  const isAdmin = currentUser?.role === "admin";

  return (
    <aside className="w-48 bg-white shadow-md h-screen p-4">
      <ul className="space-y-4">
        <li>
          <Link
            to={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
            className="text-gray-700 hover:text-blue-600"
          >
            Dashboard Home
          </Link>
        </li>

        {!isAdmin && (
          <>
            <li>
              <Link
                className="text-gray-700 hover:text-blue-600"
                to="/create-listing"
              >
                Add Listing
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-700 hover:text-blue-600"
                to="/dashboard/my-listings"
              >
                My Listings
              </Link>
            </li>
          </>
        )}

        {isAdmin && (
          <>
            <li>
              <Link
                className="text-gray-700 hover:text-blue-600"
                to="/admin/users"
              >
                Manage Users
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-700 hover:text-blue-600"
                to="/admin/listings"
              >
                Manage Listings
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}
