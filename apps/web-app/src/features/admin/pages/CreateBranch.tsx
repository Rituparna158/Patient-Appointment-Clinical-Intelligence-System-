import { useState } from "react";
import { branchSchema } from "../schemas/branch.schema";
import type { BranchForm } from "../schemas/branch.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AppointmentService } from "@/services/appointment.service";

export default function CreateBranch() {
  const { toast } = useToast();

  const [form, setForm] = useState<BranchForm>({
    name: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function handleChange<K extends keyof BranchForm>(
    field: K,
    value: BranchForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    const trimmedForm: BranchForm = {
      name: form.name.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
    };

    const result = branchSchema.safeParse(trimmedForm);

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

      await AppointmentService.createBranch(trimmedForm);

      toast({
        title: "Branch created successfully",
      });

      setForm({
        name: "",
        address: "",
        phone: "",
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

  return (
    <div className="page-container">
      <div className="form-container">
        <Card className="form-card">
          <div className="form-header">
            <h2 className="form-title">Create Branch</h2>
          </div>

          <div className="form-content">
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Branch Name</label>
              <Input
                value={form.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
              />
              <p
                className={`form-error error-transition ${
                  errors.name ? "error-show" : "error-hide"
                }`}
              >
                {errors.name}
              </p>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">Address</label>
              <Input
                value={form.address}
                onChange={(e) =>
                  handleChange("address", e.target.value)
                }
              />
              <p
                className={`form-error error-transition ${
                  errors.address ? "error-show" : "error-hide"
                }`}
              >
                {errors.address}
              </p>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
              />
              <p
                className={`form-error error-transition ${
                  errors.phone ? "error-show" : "error-hide"
                }`}
              >
                {errors.phone}
              </p>
            </div>

            <div className="form-actions">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating..." : "Create Branch"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}



