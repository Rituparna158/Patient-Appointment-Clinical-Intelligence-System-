//import { useAuthStore } from "@/store/auth/auth.store";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuthStore } from "@/store/auth/auth.store";

export default function PatientDashboard(){
    const user=useAuthStore((state)=>state.user);

    return (
    <DashboardLayout>
        <h1 className="text-3xl font-bold text-slate-800">
            Welcome Patient
        </h1>
        <p className="mt-2 text-slate-600">
            Logged in as:{user?.email}
        </p>
        <p className="mt-6 text-slate-700">
            Book appointments, view payment history, and access your medical records.
        </p>
    </DashboardLayout>
    )
}