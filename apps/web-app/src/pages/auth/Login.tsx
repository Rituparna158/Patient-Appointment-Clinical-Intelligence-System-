import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth/auth.store";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
 
export default function Login() {
    const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const res = await AuthService.login(email, password);
      const user = res.user;

      setUser(user);

      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (err: any) {
      setError(err.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle className="auth-title">Clinic Login</CardTitle>
          <p className="auth-subtitle">
            Secure access to your dashboard
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <p className="text-body">
            <Link to="/forgot-password" className="auth-link">
              Forgot Password?
            </Link>
          </p>

          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-body text-center text-muted-foreground">
            Don’t have an account?{" "}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}