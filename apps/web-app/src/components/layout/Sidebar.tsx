import { Link } from "react-router-dom";
//import { Calendar, LayoutDashboard,User } from "lucide-react";
import { useAuthStore } from "@/store/auth/auth.store";

export default function Sidebar(){
    const user=useAuthStore((s)=>s.user)
    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen p-4">
            <h2 className="text-xl font-bold mb-6">
                Clinic System
            </h2>
            <nav className="space-y-3">

                {user?.role === "patient" && (
                    <>
                    <Link to="/patient/dashboard" className="block hover :bg-slate-800 p-2 rounded">
                    Dashboard
                    </Link>
                    <Link to="/appointments" className="block hover :bg-slate-800 p-2 rounded">
                    My Appointments
                    </Link>
                    </>
                )}

                 {user?.role === "doctor" && (
                    <>
                    <Link to="/doctor/dashboard" className="block hover :bg-slate-800 p-2 rounded">
                    Dashboard
                    </Link>
                    <Link to="/doctor/appointments" className="block hover :bg-slate-800 p-2 rounded">
                    Today's Appointment
                    </Link>
                    </>
                )}

                 {user?.role === "admin" && (
                    <>
                    <Link to="/admin/dashboard" className="block hover :bg-slate-800 p-2 rounded">
                    Dashboard
                    </Link>
                    <Link to="/admin/create-doctor" className="block hover :bg-slate-800 p-2 rounded">
                    Create Doctor
                    </Link>
                     <Link to="/admin/create-admin" className="block hover :bg-slate-800 p-2 rounded">
                    Create Admin
                    </Link>
                    </>
                )}

            </nav>
        </aside>
    )
}

