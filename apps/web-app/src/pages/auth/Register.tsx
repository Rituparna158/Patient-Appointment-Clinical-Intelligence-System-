import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <div className="auth-container">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle className="auth-title">
            Patient Registration
          </CardTitle>
          <p className="auth-subtitle">
            Only Patients can self-register. Doctors are added by Admin
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Full Name */}
          <Input
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
          />

          {/* Email */}
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          {/* Phone */}
          <Input
            name="phone"
            type="number"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          {/* Gender */}
          <Select
            onValueChange={(value: any) => setForm({ ...form, gender: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>

          {/* Date of Birth */}
          <Input
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            max={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
          />

          {/* Password */}
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {/* Error message */}
          {error && <p className="auth-error">{error}</p>}

          {/* Register button */}
          <Button className="w-full" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </Button>

          {/* Login link */}
          <p className="text-body text-center text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
