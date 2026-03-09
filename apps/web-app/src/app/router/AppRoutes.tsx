import { Routes, Route } from 'react-router-dom';

import Home from '@/features/home/Home';
import Login from '@/features/auth/pages/Login';
import Register from '@/features/auth/pages/Register';

import PatientDashboard from '@/features/dashboard/PatientDashboard';
import DoctorDashboard from '@/features/dashboard/DoctorDashboard';
import AdminDashboard from '@/features/dashboard/AdminDashboard';

import ProtectedRoute from './ProtectedRoute';
import ForgotPassword from '@/features/auth/pages/ForgotPassword';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import Profile from '@/features/profile/page/Profile';
import CreateDoctor from '@/features/admin/pages/CreateDoctor';
import CreateAdmin from '@/features/admin/pages/CreateAdmin';

import CreatePatientProfile from '@/features/patient/pages/CreatePatientProfile';
import PatientProfilePage from '@/features/patient/pages/PatientProfile';
import PatientListPage from '@/features/patient/pages/PatientListPage';
import EditPatientProfile from '@/features/patient/pages/EditPatientProfile';

import BookAppointment from '@/features/patient/pages/BookAppointment';
import MyAppointments from '@/features/patient/pages/MyAppointments';
import DoctorAppointments from '@/features/doctor/pages/DoctorAppointment';
import CreateSlot from '@/features/admin/pages/CreateSlot';
import CreateBranch from '@/features/admin/pages/CreateBranch';
import AppointmentList from '@/features/admin/pages/AppointmentList';

import Payment from '@/features/payment/page/Payment';

import DoctorConsultations from '@/features/doctor/pages/DoctorConsultations';

import PatientTimeline from '@/features/patient/pages/PatientTimeline';
import AdminClinicalRecords from '@/features/admin/pages/AdminClinicalRecords';

import AppLayout from '../layout/AppLayout';
import DoctorPatientProfile from '@/features/clinical/pages/DoctorPatientProfile';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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
          <ProtectedRoute allowedRoles={['admin']}>
            <CreateDoctor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/create-admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CreateAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/create-profile"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <CreatePatientProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/patient"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <PatientListPage />
            </AppLayout>
          </ProtectedRoute>
        }
      /> 
      <Route
        path="/patient/edit-profile"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <EditPatientProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/book-appointment"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <BookAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/my-appointments"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <MyAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorAppointments />
          </ProtectedRoute>
        }
      />
       <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
              <AppointmentList />
          </ProtectedRoute>
        }
      /> 
      <Route
        path="/admin/create-slot"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <CreateSlot />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/create-branch"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <CreateBranch />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/payment/:appointmentId"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <Payment />
          </ProtectedRoute>
        }
      />

       <Route
        path="/doctor/consultations"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorConsultations />
          </ProtectedRoute>
        }
      /> 

       <Route
        path="/patient/timeline"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientTimeline />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/clinical-records"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminClinicalRecords />
          </ProtectedRoute>
        }
      /> 

      <Route
        path="/doctor/patient/:patientId"
        element={<DoctorPatientProfile/>}
        />
    </Routes>
  );
}
