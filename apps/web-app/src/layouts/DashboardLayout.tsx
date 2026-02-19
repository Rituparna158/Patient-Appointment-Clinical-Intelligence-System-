import Sidebar from "@/components/layout/Sidebar";;
import TopNavbar from "@/components/layout/TopNavbar";

export default function DashboardLayout({
        children,
    }:{
         children: React.ReactNode;
}){
    return (
        <div className="flex">
            <Sidebar/>
        <div className="flex-1">
            <TopNavbar/>

            <main className="p-6 bg-slate-50 min-h-screen">
                {children}
            </main>
        </div>
        </div>
    );
}