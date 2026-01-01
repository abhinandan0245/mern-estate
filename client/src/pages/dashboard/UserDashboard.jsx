import DashboardLayout from "./DashboardLayout";
import UserHome from "../../pages/userDashboard/UserHome";
import DashboardHeader from "../../components/DashboardHeader";

export default function UserDashboard() {
  return (
    <DashboardLayout>
      <DashboardHeader title="User Dashboard" />
      <UserHome />
    </DashboardLayout>
  );
}
