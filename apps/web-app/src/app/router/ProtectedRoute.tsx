import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/auth.store";
import type { JSX } from "react";

interface ProtectedRoutesProps{
    children:JSX.Element,
    allowedRoles?:string[]
}

export default function ProtectedRoute({
    children,
    allowedRoles,
}:ProtectedRoutesProps){

    const user=useAuthStore((s)=>s.user);

    if(!user){
        return <Navigate to="/login" replace/>;
    }
    if(allowedRoles && !allowedRoles.includes(user.role)){
        return<Navigate to="/login" replace/>;
    }
    return children;
}