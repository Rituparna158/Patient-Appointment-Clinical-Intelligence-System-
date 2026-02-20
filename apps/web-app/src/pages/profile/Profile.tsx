import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { api} from "@/services/api";
 
export default function Profile() {
  const [data, setData] = useState<any>(null);
 
  useEffect(() => {
    async function fetchData() {
      const res = await api("/auth/me", {
        method: "GET",
      });
      setData(res);
    }
    fetchData();
  }, []);
 
  if (!data) return <div>Loading...</div>;
 
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold">Profile</h2>
 
      <div className="mt-4 space-y-2">
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