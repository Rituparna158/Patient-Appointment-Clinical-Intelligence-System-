import DashboardLayout from "@/app/layout/AppLayout";
import { useAuthStore } from "@/store/auth/auth.store";

export default function PatientDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <DashboardLayout>
      <h1 className="page-heading">
        Patient Dashboard
      </h1>

      <p className="page-subtext">
        Logged in as: {user?.email}
      </p>

      <p className="page-description">
        Book appointments, track visit history, view prescriptions,
        and access medical records securely.
      </p>
    </DashboardLayout>
  );
}