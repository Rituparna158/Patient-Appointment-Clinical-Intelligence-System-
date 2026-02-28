import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  async function fetchAppointments() {
    try {
      if (!user?.id) return;
      const res = await AppointmentService.getDoctorAppointments();
      setAppointments(res.data.rows || []);
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

  async function updateStatus(id: string, status: string) {
    try {
      await AppointmentService.changeStatus(id, status);

      toast({
        title: "Status Updated",
        description: `Appointment marked as ${status}`,
      });

      fetchAppointments();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

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
            <Card key={appt.id} className="p-6 space-y-3">
              <p><strong>ID:</strong> {appt.id}</p>
              <p><strong>Patient:</strong> {appt.patientId}</p>
              <p><strong>Status:</strong> {appt.status}</p>
              <p><strong>Payment:</strong> {appt.paymentStatus}</p>

              {/* Show buttons only if confirmed */}
              {appt.status === "confirmed" && (
                <div className="flex gap-4 pt-3">
                  <Button
                    onClick={() => updateStatus(appt.id, "completed")}
                  >
                    Mark Completed
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => updateStatus(appt.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
