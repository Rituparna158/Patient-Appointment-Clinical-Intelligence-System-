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
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

type RegisterFormData = z.infer<typeof registerSchema>


export default function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
    setError("")

    try {
      await AuthService.register(data)
      navigate("/login")
    } catch (err: any) {
      setError(err.message || "Registration failed")
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

        <CardContent className="space-y-4">
          
          <Input
            placeholder="Full Name"
            {...register("full_name")}
            
          />
          {errors.full_name && <p className="auth-error">{errors.full_name.message}</p>}

         
          <Input
      
            placeholder="Email"
            {...register("email")}
          />

          {errors.phone && <p className="auth-error">{errors.phone.message}</p>}


          <Input
            type="tel"
            placeholder="Phone"
            {...register("phone")}
          />

          {errors.phone && <p className="auth-error">{errors.phone.message}</p>} 

         
          <Select
            value={watch('gender')}
            onValueChange={(value) => setValue('gender', value, { shouldValidate: true})}
          >
            
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>

          {errors.gender && <p className="auth-error">{errors.gender.message}</p>}

         
          <Input
            
            type="date"
           
            max={new Date().toISOString().split('T')[0]}
            {...register("date_of_birth")}
            
          />
          {errors.date_of_birth && <p className="auth-error">{errors.date_of_birth.message}</p>}

          
          <Input

            placeholder="Password"
            type="password"
            {...register("password")}
          />
          {errors.password && <p className="auth-error">{errors.password.message}</p>}

          {error && <p className="auth-error">{error}</p>}

        
          <Button
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Register'}
          </Button>

         
          <p className="text-body text-center text-muted-foreground">
            Already registered?{' '}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
