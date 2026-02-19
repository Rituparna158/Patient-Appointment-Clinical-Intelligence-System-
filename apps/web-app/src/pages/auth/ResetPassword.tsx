import { useState } from "react";
import { Link ,useNavigate,useLocation} from "react-router-dom";

import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth.service";

export default function ResetPassword(){
    //const location=useLocation();
    const navigate=useNavigate();

    const email=localStorage.getItem("resetEmail");

    const [otp,setOtp]=useState("");
    const [password,setPassword]=useState("");

     const [error,setError]=useState("");
    const [loading, setLoading] = useState(false);

    async function handleReset(){
        if(!email){
            setError("Email not found! Please restart forgot password flow.")
        }
        setLoading(true);
        setError("");

        try{
            await AuthService.resetPassword(otp,password);

            navigate("/login");
        }catch(err:any){
            setError(err.message)
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
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">
                        OTP sent to : <b>{email}</b>
                    </p>

                    <Input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e)=> setOtp(e.target.value)}
                    />

                    <Input
                    placeholder="Enter New Password"
                    type="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    />

                    {error && <p className="text-red-600 text-sm">{error}</p>}

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