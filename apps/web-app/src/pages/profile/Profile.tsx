import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layout/AppLayout";
import { api} from "@/services/api";
 
export default function Profile() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await api("/auth/me", { method: "GET" });
      setData(res);
    }
    fetchData();
  }, []);

  if (!data)
    return <div className="dashboard-content">Loading...</div>;

  return (
    <DashboardLayout>
      <h2 className="dashboard-heading">Profile Information</h2>

      <div className="mt-6 space-y-3 text-muted-foreground">
        <p><b>ID:</b> {data.id}</p>
        <p><b>Email:</b> {data.email}</p>
        <p><b>Full Name:</b> {data.full_name}</p>
        <p><b>Phone:</b> {data.phone}</p>
        <p><b>Gender:</b> {data.gender}</p>
        <p><b>Date of Birth:</b> {data.date_of_birth}</p>
        <p><b>Role:</b> {data.role}</p>
      </div>
    </DashboardLayout>
  );
}