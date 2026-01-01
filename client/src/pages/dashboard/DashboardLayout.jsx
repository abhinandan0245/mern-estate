// import DashboardSidebar from "../../components/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      {/* <DashboardSidebar /> */}

      <main className="flex-1 p-6 bg-gray-100 min-h-screen">{children}</main>
    </div>
  );
}
