import { useEffect } from "react";
import DashboardLayout from "@/app/layout/AppLayout";
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

export default function EditPatientProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PatientProfileForm>({
    resolver: zodResolver(patientProfileSchema),
    mode: "onChange",
  });

  useEffect(() => {
    async function fetchProfile() {
      const data = await PatientService.getMyProfile();
      setValue("address", data.address || "");
      setValue("emergencyContact", data.emergencyContact);
    }

    fetchProfile();
  }, []);

  async function onSubmit(data: PatientProfileForm) {
    try {
      await PatientService.update(data);

      toast({
        title: "Profile Updated",
        description: "Patient profile updated successfully",
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
          <h2 className="form-title">Edit Patient Profile</h2>
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
                {isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            </div>

          </form>
        </div>
      </Card>
    </DashboardLayout>
  );
}
