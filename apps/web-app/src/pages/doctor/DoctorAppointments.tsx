import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { AppointmentService } from "@/services/appointment.service";
import { useAuthStore } from "@/store/auth/auth.store";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  patientId: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function DoctorAppointments() {
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        if (!user?.id) return;

        const res = await AppointmentService.getDoctorAppointments();

        console.log("Doctor API Response:", res);

        setAppointments(res.data.rows);
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [user]);

  return (
    <DashboardLayout>
      <h2 className="page-heading">My Scheduled Appointments</h2>

      {loading ? (
        <p className="mt-6 text-muted-foreground">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          No appointments found
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {appointments.map((appt) => (
            <Card key={appt.id} className="p-6">
              <div className="space-y-2">

                <p>
                  <strong>Appointment ID:</strong> {appt.id}
                </p>

                <p>
                  <strong>Patient ID:</strong> {appt.patientId}
                </p>

                <p>
                  <strong>Status:</strong> {appt.status}
                </p>

                <p>
                  <strong>Payment:</strong> {appt.paymentStatus}
                </p>

                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(appt.createdAt).toLocaleString()}
                </p>

              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}