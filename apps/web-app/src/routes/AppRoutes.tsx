import { Routes,Route } from "react-router-dom";

import Home from "@/pages/home/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/dashboard/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

export default function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard"
            element={
                <ProtectedRoute>
                    <Dashboard/>
                </ProtectedRoute>
            }
            />
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
        </Routes>
        
    )
}