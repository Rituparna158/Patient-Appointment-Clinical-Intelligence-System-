import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layout/AppLayout";
import { AppointmentService } from "@/services/appointment.service";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@/types/appointment.types";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(1);

  async function fetchAppointments() {
    try{
        const data = await AppointmentService.myAppointments(page, 5);
        // setAppointments(data.rows || data.rows || data.appointments || data.rows);
        setAppointments(data.rows || []);

    }catch(err){
        console.error(err);
    }
    
  }

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  return (
    <DashboardLayout>
      <h2 className="page-heading">My Appointments</h2>

      <div className="mt-6 space-y-4">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="p-4 border border-border rounded-md"
          >
            <p><b>Status:</b> {appt.status}</p>
            <p><b>Payment:</b> {appt.paymentStatus}</p>
            <p><b>Reason:</b> {appt.appointmentReason}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(appt.createdAt).toLocaleString()}
            </p>
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

