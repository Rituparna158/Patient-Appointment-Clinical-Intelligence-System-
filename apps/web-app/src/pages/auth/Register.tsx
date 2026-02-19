 
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"
 
import { AuthService } from "@/services/auth.service";
 
export default function Register() {
  const navigate = useNavigate();
 
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    date_of_birth: "",
  });
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
 
  async function handleRegister() {
    setLoading(true);
    setError("");
 
    try {
      await AuthService.register(form);
 
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Patient Registration
          </CardTitle>
        </CardHeader>
 
        <CardContent className="space-y-4">
          <Input
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
          />
 
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
 
          <Input
            name="phone"
            type="number"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
 
          <Select
            onValueChange={(value:any)=>
                setForm({...form,gender: value})
            }
          >
            <SelectTrigger>
                <SelectValue placeholder="Select Gender"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
 
          <Input
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            max={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
          />
 
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
 
          {error && <p className="text-red-600 text-sm">{error}</p>}
 
          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </Button>
 
          <p className="text-sm text-center text-slate-600">
            Already registered?{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}