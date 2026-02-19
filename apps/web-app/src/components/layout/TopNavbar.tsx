import { Button } from "../ui/button";
import { useAuthStore } from "@/store/auth/auth.store";
import { AuthService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

export default function TopNavbar(){
    const user = useAuthStore((s)=>s.user);
    const logoutStore=useAuthStore((s)=>s.logout);
    const navigate=useNavigate();

    async function handleLogout(){
        await AuthService.logout();
        logoutStore();
        navigate("/login")
    }
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <h1 className="text-lg font-bold text-slate-800">
                🏥 Clinic Dashboard
            </h1>
            <div className="flex items-center gap-4">
                <p className="text-sm text-slate-600">
                    {user?.email}
                </p>
                <Button  variant="outline" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </header>          

    )
}