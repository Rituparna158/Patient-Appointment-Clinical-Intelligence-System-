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
 
      setUser(res.user);
 
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800">
            Clinic Login
          </CardTitle>
          <p className="text-sm text-slate-500">
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
 
          {error && <p className="text-sm text-red-600">{error}</p>}

        <p className="text-sm text-left text-slate-600">
            {" "}
            <Link to="/forgot-password" className="text-blue-600 text-sm font-medium">
              Forgot Password?
            </Link>
          </p>
          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
 
          <p className="text-sm text-center text-slate-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}