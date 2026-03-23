import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AuthService } from '@/services/auth.service';
import { registerSchema } from '@/schemas/auth.schema';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import FormField from '@/components/ui/FormField';

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      gender: '',
      date_of_birth: '',
      password: '',
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setError('');

    try {
      await AuthService.register(data);
      navigate('/login');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Registration failed';
      setError(message);
    }
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle className="auth-title">Patient Registration</CardTitle>
          <p className="auth-subtitle">
            Only Patients can self-register. Doctors are added by Admin
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              label="Full Name"
              required
              error={errors.full_name?.message}
              >
            <Input placeholder="Enter your full name" {...register('full_name')} />
            {/* {errors.full_name && (
              <p className="auth-error">{errors.full_name.message}</p>
            )} */}
            </FormField>

            <FormField
              label="Email"
              required
              error={errors.email?.message}
              >
            <Input placeholder="Enter your email" {...register('email')} />

            </FormField>

            {/* {errors.email && <p className="auth-error">{errors.email.message}</p>} */}

            <FormField
              label="Phone Number"
              required
              error={errors.phone?.message}
              >
            <Input type="tel" placeholder="Enter 10 digit mobile number" {...register('phone')} />
            </FormField>
            {/* {errors.phone && <p className="auth-error">{errors.phone.message}</p>} */}
             <FormField
              label="Gender"
              required
              error={errors.gender?.message}
              >
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            </FormField> 
            {/* {errors.gender && <p className="auth-error">{errors.gender.message}</p>} */}

            <FormField
              label="DOB"
              required
              error={errors.date_of_birth?.message}
              >

            <Input
              type="date"
              max={new Date().toISOString().split('T')[0]}
              {...register('date_of_birth')}
            />

            </FormField>
            {/* {errors.date_of_birth && (
              <p className="auth-error">{errors.date_of_birth.message}</p>
            )} */}

             <FormField
              label="Password"
              required
              error={errors.password?.message}
              >
            <Input
              placeholder="Enter your password"
              type="password"
              {...register('password')}
            />
            </FormField>
            {/* {errors.password && (
              <p className="auth-error">{errors.password.message}</p>
            )} */}

            {error && <p className="auth-error">{error}</p>}

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Register'}
            </Button>

            <p className="text-body text-center text-muted-foreground">
              Already registered?{' '}
              <Link to="/login" className="auth-link">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
