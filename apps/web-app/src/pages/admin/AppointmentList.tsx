import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AppointmentService } from "@/services/appointment.service";
import { Button } from "@/components/ui/button";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  async function fetchData() {
    const data = await AppointmentService.adminSearch(page, 10);
    setAppointments(data.rows);
  }

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <DashboardLayout>
      <h2 className="page-heading">All Appointments</h2>

      <div className="mt-6 space-y-4">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="p-4 border border-border rounded-md"
          >
            <p><b>Status:</b> {appt.status}</p>
            <p><b>Payment:</b> {appt.paymentStatus}</p>
            <p><b>Doctor:</b> {appt.doctorId}</p>
            <p><b>Branch:</b> {appt.branchId}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          Prev
        </Button>
        <Button onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </DashboardLayout>
  );
}
