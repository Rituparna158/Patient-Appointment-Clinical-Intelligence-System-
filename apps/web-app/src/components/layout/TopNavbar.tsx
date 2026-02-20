//import { Button } from "../ui/button";
import { useAuthStore } from "@/store/auth/auth.store";
import { AuthService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";
import { Avatar,AvatarFallback } from "@radix-ui/react-avatar";
import { DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
 } from "@radix-ui/react-dropdown-menu";

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

            <DropdownMenu>
                <DropdownMenuTrigger  asChild>
                    <div className="cursor-pointer">
                        <Avatar>
                        <AvatarFallback>
                            {user?.email?.[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer" onSelect={()=>navigate("/profile")}>
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-600" onSelect={handleLogout}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>          
    )
}