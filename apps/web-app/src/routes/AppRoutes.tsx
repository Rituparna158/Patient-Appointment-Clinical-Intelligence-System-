import { Routes,Route } from "react-router-dom";

import Home from "@/pages/home/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
//import Dashboard from "@/pages/dashboard/Dashboard";
import PatientDashboard from "@/pages/dashboard/PatientDashboard";
import DoctorDashboard from "@/pages/dashboard/DoctorDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Profile from "@/pages/profile/Profile";
import CreateDoctor from "@/pages/admin/CreateDoctor";
import CreateAdmin from "@/pages/admin/CreateAdmin";

export default function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/patient/dashboard"
            element={
                <ProtectedRoute  allowedRoles={["patient"]}>
                    <PatientDashboard/>
                </ProtectedRoute>
            }
            />
            <Route path="/doctor/dashboard"
            element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                    <DoctorDashboard/>
                </ProtectedRoute>
            }
            />
            <Route path="/admin/dashboard"
            element={
                <ProtectedRoute  allowedRoles={["admin"]}>
                    <AdminDashboard/>
                </ProtectedRoute>
            }
            />
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>

            <Route 
            path="/profile"
            element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            }
            />

            <Route
            path="/admin/create-doctor"
             element={
                <ProtectedRoute  allowedRoles={["admin"]}>
                    <CreateDoctor/>
                </ProtectedRoute>
            }
            />

            <Route
            path="/admin/create-admin"
             element={
                <ProtectedRoute  allowedRoles={["admin"]}>
                    <CreateAdmin/>
                </ProtectedRoute>
            }
            />

        </Routes>
        
    )
}