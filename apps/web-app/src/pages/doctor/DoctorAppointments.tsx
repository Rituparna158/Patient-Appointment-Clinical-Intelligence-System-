
import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AppointmentService } from "@/services/appointment.service";
import { useAuthStore } from "@/store/auth/auth.store";
import { Button } from "@/components/ui/button";
import type { AppointmentStatus } from "@/types/appointment.types";

export default function DoctorAppointments() {
  const user = useAuthStore((s) => s.user);
  const [appointments, setAppointments] = useState<any[]>([]);

  async function fetchData() {
    if (!user) return;
    const data = await AppointmentService.doctorAppointments(
      user.id,
      1,
      10
    );
    setAppointments(data.rows);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function updateStatus(id: string, status: AppointmentStatus) {
    await AppointmentService.updateStatus(id, status);
    fetchData();
  }

  return (
    <DashboardLayout>
      <h2 className="page-heading">Doctor Appointments</h2>

      <div className="mt-6 space-y-4">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="p-4 border border-border rounded-md"
          >
            <p><b>Status:</b> {appt.status}</p>
            <p><b>Payment:</b> {appt.paymentStatus}</p>

            <div className="flex gap-2 mt-3">
              <Button
                onClick={() =>
                  updateStatus(appt.id, "completed")
                }
              >
                Complete
              </Button>

              <Button
                variant="destructive"
                onClick={() =>
                  updateStatus(appt.id, "cancelled")
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}