import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";

import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth.service";

export default function ResetPassword() {
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email) {
      setError("Email not found! Restart forgot password flow.");
      return;
    }

    if (!otp || !newPassword) {
      setError("OTP and new password are required");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await AuthService.resetPassword(email, otp, newPassword);
      setMessage(res.message || "Password reset successful");
      localStorage.removeItem("resetEmail");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Reset Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle className="auth-title">Reset Password</CardTitle>
          {email && (
            <p className="auth-subtitle">
              OTP sent to: <span className="font-medium">{email}</span>
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Input
            placeholder="Enter New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <Button className="w-full" onClick={handleReset} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          <p className="text-body text-center text-muted-foreground">
            Back to{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}