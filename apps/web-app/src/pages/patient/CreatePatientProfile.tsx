import DashboardLayout from "@/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/hooks/use-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  patientProfileSchema,
  type PatientProfileForm,
} from "@/schemas/patient.schema";

import { PatientService } from "@/services/patient.service";
import { useNavigate } from "react-router-dom";

export default function CreatePatientProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientProfileForm>({
    resolver: zodResolver(patientProfileSchema),
    mode: "onChange",
  });

  async function onSubmit(data: PatientProfileForm) {
    try {
      await PatientService.create(data);

      toast({
        title: "Profile Created",
        description: "Patient profile created successfully",
      });

      navigate("/patient/profile");
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
          <h2 className="form-title">Create Patient Profile</h2>
        </div>

        <div className="form-content">
          <form onSubmit={handleSubmit(onSubmit)} className="form-grid">

            <FormField
              label="Address"
              error={errors.address?.message}
            >
              <Input {...register("address")} />
            </FormField>

            <FormField
              label="Emergency Contact"
              required
              error={errors.emergencyContact?.message}
            >
              <Input {...register("emergencyContact")} />
            </FormField>

            <div className="col-span-2 mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Create Profile"}
              </Button>
            </div>

          </form>
        </div>
      </Card>
    </DashboardLayout>
  );
}
