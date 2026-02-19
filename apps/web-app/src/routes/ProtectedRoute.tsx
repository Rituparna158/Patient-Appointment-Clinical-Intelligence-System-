import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/auth.store";
import type { JSX } from "react";

export default function ProtectedRoute({
    children,
}:{
     children: JSX.Element
}){
    const user=useAuthStore((s)=>s.user);

    if(!user){
        return <Navigate to="/login" replace/>;
    }
    return children;
}