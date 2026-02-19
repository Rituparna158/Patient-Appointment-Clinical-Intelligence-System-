import { Link } from "react-router-dom";
import { Calendar, LayoutDashboard,User } from "lucide-react";

export default function Sidebar(){
    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen p-4">
            <h2 className="text-xl font-bold mb-6">
                Clinic System
            </h2>
            <nav className="space-y-3">
                <Link
                to="/dashboard"
                className="flex items-center gap-2 p-2 rounded-lg hover :bg-slate-800">
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>

                <Link
                to="/appointments"
                className="flex items-center gap-2 p-2 rounded-lg hover :bg-slate-800">
                    <Calendar size={18} />
                    Appointments
                </Link>
                <Link
                to="/patients"
                className="flex items-center gap-2 p-2 rounded-lg hover :bg-slate-800">
                    <User size={18} />
                    Patients
                </Link>
            </nav>
        </aside>
    )
}

