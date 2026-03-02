import DashboardLayout from "@/app/layout/AppLayout";
import { useAuthStore } from "@/store/auth/auth.store";

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <DashboardLayout>
      <h1 className="page-heading">
        Administrator Dashboard
      </h1>

      <p className="page-subtext">
        Logged in as: {user?.email}
      </p>

      <p className="page-description">
        Manage doctors, administrators, branches, and clinic operations.
      </p>
    </DashboardLayout>
  );
}
