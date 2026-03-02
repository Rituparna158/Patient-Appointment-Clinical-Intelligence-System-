import { useState } from "react";
import DashboardLayout from "@/app/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppointmentService } from "@/services/appointment.service";
import { useToast } from "@/hooks/use-toast";

export default function CreateSlot() {
  const { toast } = useToast();

  const [doctorId, setDoctorId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  async function handleCreate() {
    try {
      await AppointmentService.createSlot({
        doctorId,
        branchId,
        startTime,
        endTime,
      });

      toast({
        title: "Slot Created",
        description: "Doctor slot created successfully",
      });

      setDoctorId("");
      setBranchId("");
      setStartTime("");
      setEndTime("");
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
            Create Doctor Slot
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
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <Button onClick={handleCreate}>
            Create Slot
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}