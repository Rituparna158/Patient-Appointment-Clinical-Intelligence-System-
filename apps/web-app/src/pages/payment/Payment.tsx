import FormField from "@/components/ui/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppointmentService } from "@/services/appointment.service";
import {
    type PaymentForm, 
    paymentSchema } from "@/schemas/payment.schema";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";


export default function Payment() {
    const { appointmentId } = useParams();
    const { toast } = useToast();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
      } = useForm<PaymentForm>({
        resolver: zodResolver(paymentSchema),
        mode: "onChange",
      });

        async function onSubmit(_data: PaymentForm) {
          try {
            if(!appointmentId) return;

            await AppointmentService.pay(appointmentId);
      
            toast({
              title: "Payment Done",
              description: "Payment done successfully",
            });
      
            navigate("/patient/my-appointments");
          } catch (err: any) {
            toast({
              variant: "destructive",
              title: "Payment failed",
              description: err.message,
            });
          }
        }

    return (
        <DashboardLayout>
            <Card className="form-card">
                <div className="form-header">
                <h2 className="form-title">Secure Payment</h2>
                </div>

                <div className="form-content">
                <form onSubmit={handleSubmit(onSubmit)} className="form-grid">

                    <FormField
                    label="CardNumber"
                    required
                    error={errors.card_number?.message}
                    >
                    <Input 
                    placeholder="123XXXXXXXXXXXXX"
                    {...register("card_number")} />
                    </FormField>

                    <FormField
                    label="Expiry"
                    required
                    error={errors.expiry?.message}
                    >
                    <Input 
                    {...register("expiry")} />
                    </FormField>

                    <FormField
                    label="CVV"
                    required
                    error={errors.cvv?.message}
                    >
                    <Input {...register("cvv")} />
                    </FormField>

                    <div className="col-span-2 mt-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Payment done"}
                    </Button>
                    </div>

                </form>
                </div>
            </Card>
            </DashboardLayout>
    )
}
