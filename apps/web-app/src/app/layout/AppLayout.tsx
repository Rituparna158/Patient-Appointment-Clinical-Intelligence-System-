import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="h-screen flex overflow-hidden">
   
      <Sidebar />
     
      <div className="flex flex-col flex-1 ">
        <TopNavbar />

       
        <main className="flex-1  overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
