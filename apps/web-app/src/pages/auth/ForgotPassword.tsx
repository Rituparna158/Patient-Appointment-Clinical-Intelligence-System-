import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";

import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/auth.service";

export default function ForgotPassword(){
   const  navigate=useNavigate()
    const [email,setEmail]=useState("");
    const [error,setError]=useState("");
    const [loading, setLoading] = useState(false);

     async function handleSendOtp()  {
        setLoading(true);
        setError("");

        try{
            await AuthService.forgotPassword(email);
            localStorage.setItem("resetEmail",email)
            navigate("/reset-password");
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
                        Forgot Password
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <Button 
                    className="w-full"
                    onClick={handleSendOtp}
                    disabled={loading}
                    >
                        {loading ?  "Sending OTP....":"Send OTP"}
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