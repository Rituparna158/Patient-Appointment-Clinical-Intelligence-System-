import DashboardLayout from "@/app/layout/AppLayout";
import { useAuthStore } from "@/store/auth/auth.store";

export default function DoctorDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <DashboardLayout>
      <h1 className="page-heading">
        Doctor Dashboard
      </h1>

      <p className="page-subtext">
        Logged in as: {user?.email}
      </p>

      <p className="page-description">
        View scheduled appointments, update consultation notes,
        and manage patient clinical records.
      </p>
    </DashboardLayout>
  );
}