import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";

import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth.service";

export default function ResetPassword(){
    //const location=useLocation();
    const navigate=useNavigate();

    const email=localStorage.getItem("resetEmail");
    
    const [otp,setOtp]=useState("");
    const [newPassword,setnewPassword]=useState("");

     const [error,setError]=useState("");
     const [message,setMessage]=useState("");
    const [loading, setLoading] = useState(false);

    async function handleReset(){
        if(!email){
            setError("Email not found! Please restart forgot password flow.");
            return;

        }
         if(!otp || !newPassword){
            setError("OTP and new password are required");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("")

        try{
            const res=await AuthService.resetPassword(email,otp,newPassword);
            setMessage(res.message|| "Password reset successfull")
            localStorage.removeItem("resetEmail");
            navigate("/login");
        }catch(err:any){
            setError(err.message|| "Reset Failed")
        }finally{
            setLoading(false);
        }
        
    }
    return (
        <div className="min-h-screen flex justify-center items-center bg-slate-50">
            <Card className="w-full max-w-md shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Reset Password
                    </CardTitle>
                    {email && (
                        <p className="text-sm text-slate-500">
                            OTP sent to : <span className="font-medium">{email}</span>
                        </p>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e)=> setOtp(e.target.value)}
                    />

                    <Input
                    placeholder="Enter New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e)=> setnewPassword(e.target.value)}
                    />

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    {message && (
                        <p className="text-sm text-green-600 font-medium">
                            {message}
                        </p>
                    )}

                    <Button 
                    className="w-full"
                    onClick={handleReset}
                    disabled={loading}
                    >
                        {loading ?  "Resetting....":"Reset Password"}
                    </Button>

                    <p className="text-sm text-center text-slate-600">
                        Bact To{" "}
                        <Link to="/login" className="text-blue-600 font-medium">
                            Login
                        </Link>
                    </p>

                </CardContent>
            </Card>
        </div>
    )
}