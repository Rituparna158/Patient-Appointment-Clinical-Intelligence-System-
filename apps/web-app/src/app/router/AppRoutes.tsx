import { Routes,Route } from "react-router-dom";

import Home from "@/pages/home/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

import PatientDashboard from "@/pages/dashboard/PatientDashboard";
import DoctorDashboard from "@/pages/dashboard/DoctorDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Profile from "@/pages/profile/Profile";
import CreateDoctor from "@/pages/admin/CreateDoctor";
import CreateAdmin from "@/pages/admin/CreateAdmin";

import CreatePatientProfile from "@/pages/patient/CreatePatientProfile";
import PatientProfilePage from "@/pages/patient/PatientProfile";
import PatientListPage from "@/features/admin/patients/PatientListPage";
import EditPatientProfile from "@/pages/patient/EditPatientProfile";

import BookAppointment from "@/pages/patient/BookAppointment";
import MyAppointments from "@/pages/patient/MyAppointments";
import DoctorAppointments from "@/features/doctor/pages/DoctorAppointment";
import CreateSlot from "@/features/admin/pages/CreateSlot";
import CreateBranch from "@/features/admin/pages/CreateBranch";
import AppointmentList from "@/features/admin/pages/AppointmentList";

import Payment from "@/pages/payment/Payment";

import AppLayout from "../layout/AppLayout";



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

            <Route
            path="/patient/create-profile"
            element={
                <ProtectedRoute allowedRoles={["patient"]}>
                <CreatePatientProfile />
                </ProtectedRoute>
            }
            />

            <Route
            path="/patient/profile"
            element={
                <ProtectedRoute allowedRoles={["patient"]}>
                    <AppLayout>
                        <PatientProfilePage />
                    </AppLayout>
                
                </ProtectedRoute>
            }
            />

            <Route
            path="/admin/patient"
            element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout>
                        <PatientListPage />
                    </AppLayout>
                
                </ProtectedRoute>
            }
            />
            <Route
            path="/patient/edit-profile"
            element={
                <ProtectedRoute allowedRoles={["patient"]}>
                    <EditPatientProfile/>
                </ProtectedRoute>
            }
            />
            <Route
            path="/patient/book-appointment"
            element={
                <ProtectedRoute allowedRoles={["patient"]}>
                    <BookAppointment/>
                </ProtectedRoute>
            }
            />
            <Route
            path="/patient/my-appointments"
            element={
                <ProtectedRoute allowedRoles={["patient"]}>
                    <MyAppointments />
                </ProtectedRoute>
            }
            />
            <Route
            path="/doctor/appointments"
            element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                    <DoctorAppointments />
                </ProtectedRoute>
            }
            />
            <Route
            path="/admin/appointments"
            element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout>
                        <AppointmentList />
                    </AppLayout>
                    
                </ProtectedRoute>
            }
            />
            <Route
            path="/admin/create-slot"
            element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout>
                        <CreateSlot />
                    </AppLayout>
                    
                </ProtectedRoute>
            }
            />

            <Route
            path="/admin/create-branch"
            element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout>
                        <CreateBranch />
                    </AppLayout>
                    
                </ProtectedRoute>
            }
            />

            <Route
            path="/patient/payment/:appointmentId"
            element={
                <ProtectedRoute allowedRoles={["patient"]}>
                    <Payment />
                </ProtectedRoute>
            }
            />

        </Routes>
        
    )
}