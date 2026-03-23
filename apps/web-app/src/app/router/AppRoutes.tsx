import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../layout/AppLayout';
const  Unauthorized = lazy (() => import('@/pages/Unauthorized'));

const Home = lazy(() => import('@/features/home/Home'));
const Login = lazy(() => import('@/features/auth/pages/Login'));
const Register = lazy(() => import('@/features/auth/pages/Register'));
const ForgotPassword = lazy(() => import('@/features/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/features/auth/pages/ResetPassword'));

const PatientDashboard = lazy(() => import('@/features/dashboard/PatientDashboard'));
const DoctorDashboard = lazy(() => import('@/features/dashboard/DoctorDashboard'));
const AdminDashboard = lazy(() => import('@/features/dashboard/AdminDashboard'));

const Profile = lazy(() => import('@/features/profile/page/Profile'));

const CreateDoctor = lazy(() => import('@/features/admin/pages/CreateDoctor'));
const CreateAdmin = lazy(() => import('@/features/admin/pages/CreateAdmin'));
const CreateSlot = lazy(() => import('@/features/admin/pages/CreateSlot'));
const CreateBranch = lazy(() => import('@/features/admin/pages/CreateBranch'));
const AppointmentList = lazy(() => import('@/features/admin/pages/AppointmentList'));
const AdminClinicalRecords = lazy(
  () => import('@/features/admin/pages/AdminClinicalRecords')
);

const CreatePatientProfile = lazy(
  () => import('@/features/patient/pages/CreatePatientProfile')
);
const PatientProfilePage = lazy(
  () => import('@/features/patient/pages/PatientProfile')
);
const PatientListPage = lazy(() => import('@/features/patient/pages/PatientListPage'));
const DoctorListPage = lazy(() => import('@/features/admin/pages/DoctorListPage'));
const EditPatientProfile = lazy(
  () => import('@/features/patient/pages/EditPatientProfile')
);
const BookAppointment = lazy(() => import('@/features/patient/pages/BookAppointment'));
const MyAppointments = lazy(() => import('@/features/patient/pages/MyAppointments'));
const PatientTimeline = lazy(() => import('@/features/patient/pages/PatientTimeline'));

const DoctorAppointments = lazy(
  () => import('@/features/doctor/pages/DoctorAppointment')
);
const DoctorConsultations = lazy(
  () => import('@/features/doctor/pages/DoctorConsultations')
);
const DoctorPatientProfile = lazy(
  () => import('@/features/clinical/pages/DoctorPatientProfile')
);

const Payment = lazy(() => import('@/features/payment/page/Payment'));
const NotFound = lazy(() => import('@/pages/notFound'));

function RouteLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
      Loading...
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
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
        path="/admin/patient/patient-search"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <PatientListPage />
            </AppLayout>
          </ProtectedRoute>
        }
      /> 

      <Route
        path="/admin/patient/doctor-search"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <DoctorListPage />
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
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorPatientProfile/>
          </ProtectedRoute>
        }
        />

          <Route path="/unauthorized" element={<Unauthorized/>} />

        <Route path="*" element={<NotFound/>} />
  
    </Routes>
    </Suspense>
  );
}
