import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth/auth.store';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '@/schemas/auth.schema';
import type { z } from "zod"
import FormField from '@/components/ui/FormField';

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {

  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange" 
  })

  async function onSubmit(data: LoginFormData) {

    const res = await AuthService.login(
      data.email,
      data.password
    )

    const user = res.user
    const token = res.token
    setUser(user,token)

    if (user.roles.includes("admin")) navigate("/admin/dashboard")
    else if (user.roles.includes("doctor")) navigate("/doctor/dashboard")
    else navigate("/patient/dashboard")

  }


  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle className="auth-title">Clinic Login</CardTitle>
          <p className="auth-subtitle">Secure access to your dashboard</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <FormField
            label="Email"
            required
            error={errors.email?.message}
            >
          <Input
            placeholder="Enter your registered email"
            {...register("email")}
          />
          </FormField>

          <FormField
            label="Password"
            required
            error={errors.password?.message}
            >
          <Input
            placeholder="Enter your password"
            type="password"
            {...register("password")}
          />
          </FormField>

          <p className="text-body">
            <Link to="/forgot-password" className="auth-link">
              Forgot Password?
            </Link>
          </p>

          <Button className="w-full" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>

          <p className="text-body text-center text-muted-foreground">
            Don’t have an account?{' '}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
