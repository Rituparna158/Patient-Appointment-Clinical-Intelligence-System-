import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import FormField from "@/components/ui/FormField";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseUserSchema } from "@/schemas/user.schema";
import { z } from "zod";

type AdminForm = z.infer<typeof baseUserSchema>;

export default function CreateAdmin() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminForm>({
    resolver: zodResolver(baseUserSchema),
    mode: "onBlur", 
  });

  async function onSubmit(data: AdminForm) {
    try {
      await api("/admin/create-admin", {
        method: "POST",
        body: JSON.stringify(data),
      });

      toast({
        title: "Admin Created",
        description: "Admin created successfully",
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
          <h2 className="form-title">Create Administrator</h2>
        </div>

        <div className="form-content">
          <form onSubmit={handleSubmit(onSubmit)} className="form-grid">

            <FormField
              label="Full Name"
              required
              error={errors.full_name?.message}
            >
              <Input {...register("full_name")} />
            </FormField>

            <FormField
              label="Email"
              required
              error={errors.email?.message}
            >
              <Input {...register("email")} />
            </FormField>

            <FormField
              label="Phone"
              required
              error={errors.phone?.message}
            >
              <Input {...register("phone")} />
            </FormField>

            <div className="col-span-2 mt-4">
              <Button type="submit">
                Create Admin
              </Button>
            </div>

          </form>
        </div>

      </Card>
    </DashboardLayout>
  );
}