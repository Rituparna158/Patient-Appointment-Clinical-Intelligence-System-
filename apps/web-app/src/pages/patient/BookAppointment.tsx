import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppointmentService } from "@/services/appointment.service";
import { useToast } from "@/hooks/use-toast";

export default function BookAppointment() {
  const { toast } = useToast();

  const [doctorId, setDoctorId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  async function fetchSlots() {
    try{
        const data = await AppointmentService.getAvailableSlots(
        doctorId,
        date
        );
        console.log("slots:",data);
        setSlots(data);

    }catch(err){
        console.error(err);
    }
    
    
  }

  async function handleBook() {
    try {
      const appointment =
        await AppointmentService.book({
          doctorId,
          branchId,
          slotId: selectedSlot,
        });

      //await AppointmentService.pay(appointment.id);

      toast({
        title: "Appointment Booked",
        description: "Payment successful & confirmed",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
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

          {slots.map((slot) => (
            <div key={slot.id}>
              <input
                type="radio"
                name="slot"
                value={slot.slotId}
                onChange={() => setSelectedSlot(slot.slotId)}
              />
              {new Date(slot.startTime).toLocaleTimeString()}
            </div>
          ))}

          <Button >
            Payment 
          </Button>

          <Button onClick={handleBook}>
            Confirm Booking
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}






