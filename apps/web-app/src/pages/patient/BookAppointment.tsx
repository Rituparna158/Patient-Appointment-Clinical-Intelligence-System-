import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/app/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppointmentService } from "@/services/appointment.service";
import { useToast } from "@/hooks/use-toast";

export default function BookAppointment() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  async function fetchSlots() {
    try {
      if (!doctorId || !date) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Doctor ID and Date required",
        });
        return;
      }

      const data = await AppointmentService.getAvailableSlots(
        doctorId,
        date
      );

      setSlots(data || []);

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  }

  async function handleBook() {
    try {
      if (!selectedSlot) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a slot",
        });
        return;
      }

      const appointment = await AppointmentService.book({
        doctorId,
        branchId,
        slotId: selectedSlot,
      });

      toast({
        title: "Appointment Created",
        description: "Redirecting to payment...",
      });

     
      navigate(`/patient/payment/${appointment.id}`);

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: err.message,
      });
    }
  }

  return (
    <DashboardLayout>
      <Card className="form-card">

        <div className="form-header">
          <h2 className="form-title">
            Book Appointment
          </h2>
        </div>

        <div className="form-content space-y-4">

          <Input
            placeholder="Doctor ID"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          />

          <Input
            placeholder="Branch ID"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          />

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Button onClick={fetchSlots}>
            Check Available Slots
          </Button>

          {slots.length > 0 && (
            <div className="space-y-2 mt-4">
              {slots.map((slot) => (
                <label
                  key={slot.id}
                  className="flex items-center gap-2 border p-2 rounded-md cursor-pointer"
                >
                  <input
                    type="radio"
                    name="slot"
                    value={slot.id}
                    onChange={() => setSelectedSlot(slot.id)}
                  />
                  {new Date(`1970-01-01T${slot.startTime}`).toLocaleTimeString([],{
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </label>
              ))}
            </div>
          )}

          <Button
            onClick={handleBook}
            className="mt-4"
          >
            Proceed to Payment
          </Button>

        </div>
      </Card>
    </DashboardLayout>
  );
}