import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormField from "@/components/ui/FormField";

import { paymentSchema, type PaymentForm } from "@/schemas/payment.schema";
import { AppointmentService } from "@/services/appointment.service";
import { useToast } from "@/hooks/use-toast";

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  
  useEffect(() => {
    if (!appointmentId) {
      toast({
        variant: "destructive",
        title: "Invalid Payment",
        description: "Appointment ID missing",
      });
      navigate("/patient/my-appointments");
    }
  }, [appointmentId]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    mode: "onBlur",
  });

  async function onSubmit(_data: PaymentForm) {
    try {
      if (!appointmentId) return;

      toast({
        title: "Processing Payment",
        description: "Please wait...",
      });

      await AppointmentService.pay(appointmentId);

      toast({
        title: "Payment Successful",
        description: "Appointment confirmed",
      });

      navigate("/patient/my-appointments");

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: err.message,
      });
    }
  }

  if (!appointmentId) return null;

  return (
    <DashboardLayout>
      <Card className="form-card">

        <div className="form-header">
          <h2 className="form-title">
            Secure Payment
          </h2>
        </div>

        <div className="form-content">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >

            <FormField
              label="Card Number"
              required
              error={errors.card_number?.message}
            >
              <Input
                placeholder="1234123412341234"
                {...register("card_number")}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-6">

              <FormField
                label="Expiry (MM/YY)"
                required
                error={errors.expiry?.message}
              >
                <Input
                  placeholder="12/28"
                  {...register("expiry")}
                />
              </FormField>

              <FormField
                label="CVV"
                required
                error={errors.cvv?.message}
              >
                <Input
                  type="password"
                  placeholder="123"
                  {...register("cvv")}
                />
              </FormField>

            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Pay Now"}
            </Button>

          </form>
        </div>

      </Card>
    </DashboardLayout>
  );
}