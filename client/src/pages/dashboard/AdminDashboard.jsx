import DashboardLayout from "../dashboard/DashboardLayout";
import AdminHome from "../../pages/adminDashboard/AdminHome";
import DashboardHeader from "../../components/DashboardHeader";

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <DashboardHeader title="Admin Overview" />
      <AdminHome />
    </DashboardLayout>
  );
}
