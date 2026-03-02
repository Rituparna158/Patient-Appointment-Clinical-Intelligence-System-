import DashboardLayout from "@/app/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorSchema } from "@/schemas/user.schema";
import { z } from "zod";

type DoctorForm = z.infer<typeof doctorSchema>;

export default function CreateDoctor() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DoctorForm>({
    resolver: zodResolver(doctorSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: DoctorForm) {
    try {
      await api("/admin/create-doctor", {
        method: "POST",
        body: JSON.stringify(data),
      });

      toast({
        title: "Doctor Created",
        description: "Doctor created successfully",
      });

      reset();

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
          <h2 className="form-title">Create Doctor</h2>
        </div>

        <div className="form-content">
          <form onSubmit={handleSubmit(onSubmit)} className="form-grid">

            <FormField label="Full Name" required error={errors.full_name?.message}>
              <Input {...register("full_name")} />
            </FormField>

            <FormField label="Email" required error={errors.email?.message}>
              <Input {...register("email")} />
            </FormField>

            <FormField label="Phone" required error={errors.phone?.message}>
              <Input {...register("phone")} />
            </FormField>

            <FormField label="Specialization" required error={errors.specialization?.message}>
              <Input {...register("specialization")} />
            </FormField>

            <FormField label="Licence Number" required error={errors.licence_no?.message}>
              <Input {...register("licence_no")} />
            </FormField>

            <FormField label="Consultation Fee" required error={errors.consultation_fee?.message}>
              <Input
                type="number"
                {...register("consultation_fee", { valueAsNumber: true })}
              />
            </FormField>

            
              <Button type="submit">
                Create Doctor
              </Button>
            

          </form>
        </div>

      </Card>
    </DashboardLayout>
  );
}
