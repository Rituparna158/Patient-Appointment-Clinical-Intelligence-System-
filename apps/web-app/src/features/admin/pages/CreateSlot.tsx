import { useEffect, useMemo, useState } from "react";
import { slotSchema, type  SlotForm } from "../schemas/slot.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AppointmentService } from "@/services/appointment.service";
import type { Doctor, Branch } from "@/types/appointment.types";

export default function CreateSlot() {
  const { toast } = useToast();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [form, setForm] = useState<SlotForm>({
    doctorId: "",
    branchId: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function loadData() {
      const docs = (await AppointmentService.getDoctors()) as Doctor[];
      const br = (await AppointmentService.getBranches()) as Branch[];
      setDoctors(docs);
      setBranches(br);
    }

    loadData();
  }, []);

 

  useEffect(() => {
    if (!form.startTime) return;

    const start = new Date(form.startTime);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const year = end.getFullYear();
    const month = String(end.getMonth() + 1).padStart(2, "0");
    const day = String(end.getDate()).padStart(2, "0");
    const hours = String(end.getHours()).padStart(2, "0");
    const minutes = String(end.getMinutes()).padStart(2, "0");

    const localFormatted = `${year}-${month}-${day}T${hours}:${minutes}`;

    setForm((prev) => ({
      ...prev,
      endTime: localFormatted,
    }));
  }, [form.startTime]);

 

  const groupedDoctors = useMemo(() => {
    return doctors.reduce<Record<string, Doctor[]>>((acc, doctor) => {
      const spec = doctor.specialization || "Other";

      if (!acc[spec]) {
        acc[spec] = [];
      }

      acc[spec].push(doctor);
      return acc;
    }, {});
  }, [doctors]);

  

  function handleChange<K extends keyof SlotForm>(
    field: K,
    value: SlotForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }



  async function handleSubmit() {
    const result = slotSchema.safeParse(form);

    if (!result.success) {
      const formatted: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (typeof field === "string") {
          formatted[field] = err.message;
        }
      });

      setErrors(formatted);
      return;
    }

    try {
      setLoading(true);

      await AppointmentService.createSlot(form);

      toast({
        title: "Slot created successfully",
      });

      setForm({
        doctorId: "",
        branchId: "",
        startTime: "",
        endTime: "",
      });

      setErrors({});
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  const now = new Date().toISOString().slice(0, 16);



  return (
    <div className="page-container">
      <div className="form-container">
        <Card className="form-card">
          <div className="form-header">
            <h2 className="form-title">Create Doctor Slot</h2>
          </div>

          <div className="form-content">
            {/* Doctor */}
            <div className="form-group">
              <label className="form-label">Doctor</label>

              <Select
                value={form.doctorId}
                onValueChange={(value) =>
                  handleChange("doctorId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>

                <SelectContent>
                  {Object.entries(groupedDoctors).map(
                    ([spec, docs]) => (
                      <SelectGroup key={spec}>
                        <SelectLabel>{spec}</SelectLabel>

                        {docs.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.user.full_name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )
                  )}
                </SelectContent>
              </Select>

              <p
                className={`form-error error-transition ${
                  errors.doctorId ? "error-show" : "error-hide"
                }`}
              >
                {errors.doctorId}
              </p>
            </div>

            {/* Branch */}
            <div className="form-group">
              <label className="form-label">Branch</label>

              <Select
                value={form.branchId}
                onValueChange={(value) =>
                  handleChange("branchId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>

                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <p
                className={`form-error error-transition ${
                  errors.branchId ? "error-show" : "error-hide"
                }`}
              >
                {errors.branchId}
              </p>
            </div>

          
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <Input
                  type="datetime-local"
                  min={now}
                  value={form.startTime}
                  onChange={(e) =>
                    handleChange("startTime", e.target.value)
                  }
                />
                <p
                  className={`form-error error-transition ${
                    errors.startTime ? "error-show" : "error-hide"
                  }`}
                >
                  {errors.startTime}
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <Input
                  type="datetime-local"
                  value={form.endTime}
                  disabled
                />
                <p
                  className={`form-error error-transition ${
                    errors.endTime ? "error-show" : "error-hide"
                  }`}
                >
                  {errors.endTime}
                </p>
              </div>
            </div>

            <div className="form-actions">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating..." : "Create Slot"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}