import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";

import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth.service";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp() {
    setLoading(true);
    setError("");

    try {
      await AuthService.forgotPassword(email);
      localStorage.setItem("resetEmail", email);
      navigate("/reset-password");
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
          <CardTitle className="auth-title">Forgot Password</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <Button className="w-full" onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
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
