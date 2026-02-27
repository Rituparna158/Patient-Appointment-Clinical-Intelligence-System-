import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { PatientService } from "@/services/patient.service";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { PatientProfile } from "@/types/patient.types";

export default function PatientProfilePage() {
  const [data, setData] = useState<PatientProfile | null>(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete your profile?"))
    return;

  await PatientService.delete();

  navigate("/patient/dashboard");
};

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await PatientService.getMyProfile();
        setData(data);
      } catch {
        navigate("/patient/create-profile");
      }
    }

    fetchProfile();
  }, []);

  if (!data)
    return <div className="dashboard-content">Loading...</div>;

  return (
    <DashboardLayout>
      <h2 className="page-heading">Patient Profile</h2>

      <div className="mt-6 space-y-3 text-muted-foreground">
        <p><b>Address:</b> {data.address}</p>
        <p><b>Emergency Contact:</b> {data.emergencyContact}</p>
        <p><b>Status:</b> {data.isActive ? "Active" : "Inactive"}</p>
      </div>

      <Button
        className="mt-6"
        onClick={() => navigate("/patient/edit-profile")}
      >
        Edit Profile
      </Button>
      <Button
        variant="destructive"
        className="mt-4 ml-4"
        onClick={handleDelete}
        >
        Delete Profile
        </Button>

    </DashboardLayout>
  );
}
