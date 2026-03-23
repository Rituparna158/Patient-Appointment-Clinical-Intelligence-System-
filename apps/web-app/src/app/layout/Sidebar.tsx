import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth/auth.store';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  CalendarDays,
  Menu,
  Bookmark,
  CalendarPlus2,
  House,
  FileText,
  Clock,
  Hospital,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen , setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const linkClass = (path: string) =>
    `sidebar-link ${
      isActive(path) ? 'sidebar-link-active' : 'sidebar-link-hover'
    }`;

    const isAdmin = user?.roles.includes("admin");
    const isDoctor = user?.roles.includes("doctor");
    const isPatient = user?.roles.includes("patient")
  return (

    <>
  
      <button
        className="fixed top-4 left-4 z-50 sm:hidden bg-card border p-2 rounded-md"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </button>
 
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    <aside
        className={`
          sidebar fixed sm:static z-50 h-full
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0
          transition-transform duration-300
        `}
      >
      
      <div className="sidebar-header justify-between">
        {!collapsed && (
          <span className="font-semibold text-lg">Clinical System</span>
        )}

        <div className="flex items-center gap-2">
            {/* collapse button (desktop) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden sm:block"
            >
              <Menu size={20} />
            </button>
 
            {/* close button (mobile) */}
            <button
              onClick={() => setMobileOpen(false)}
              className="sm:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>


      <nav className="sidebar-nav overflow-y-auto">
        {isAdmin && (
          <>
            <Link
              to="/admin/dashboard"
              className={linkClass('/admin/dashboard')}
            >
              <LayoutDashboard size={18} />
              {!collapsed && 'Dashboard'}
            </Link>

            <Link
              to="/admin/create-doctor"
              className={linkClass('/admin/create-doctor')}
            >
              <UserPlus size={18} />
              {!collapsed && 'Create Doctor'}
            </Link>

            <Link
              to="/admin/create-admin"
              className={linkClass('/admin/create-admin')}
            >
              <Users size={18} />
              {!collapsed && 'Create Admin'}
            </Link>

            <Link to="/admin/patient/patient-search" className={linkClass('/admin/patient/patient-search')}>
              <Users size={18} />
              {!collapsed && 'Patients'}
            </Link>

            <Link to="/admin/patient/doctor-search" className={linkClass('/admin/patient/doctor-search')}>
              <Hospital size={18} />
              {!collapsed && 'Doctors'}
            </Link>

            <Link
              to="/admin/appointments"
              className={linkClass('/admin/appointments')}
            >
              <Bookmark size={18} />
              {!collapsed && 'Appointments'}
            </Link>

            <Link
              to="/admin/create-slot"
              className={linkClass('/admin/create-slot')}
            >
              <CalendarPlus2 size={18} />
              {!collapsed && 'Create Slot'}
            </Link>

            <Link
              to="/admin/create-branch"
              className={linkClass('/admin/create-branch')}
            >
              <House size={18} />
              {!collapsed && 'Create Branch'}
            </Link>

            <Link
              to="/admin/clinical-records"
              className={linkClass('/admin/clinical-records')}
            >
              <House size={18} />
              {!collapsed && 'Clinical Records'}
            </Link>
          </>
        )}

        {isDoctor && (
          <>
            <Link
              to="/doctor/dashboard"
              className={linkClass('/doctor/dashboard')}
            >
              <LayoutDashboard size={18} />
              {!collapsed && 'Dashboard'}
            </Link>

            <Link
              to="/doctor/appointments"
              className={linkClass('/doctor/appointments')}
            >
              <CalendarDays size={18} />
              {!collapsed && 'Appointments'}
            </Link>

            <Link
              to="/doctor/consultations"
              className={linkClass('/doctor/consultations')}
            >
              <FileText size={18} />
              {!collapsed && 'Consultations'}
            </Link>
          </>
        )}

        {isPatient && (
          <>
            <Link
              to="/patient/dashboard"
              className={linkClass('/patient/dashboard')}
            >
              <LayoutDashboard size={18} />
              {!collapsed && 'Dashboard'}
            </Link>

            <Link
              to="/patient/profile"
              className={linkClass('/patient/profile')}
            >
              <Users size={18} />
              {!collapsed && 'My Profile'}
            </Link>

            <Link
              to="/patient/book-appointment"
              className={linkClass('/patient/book-appointment')}
            >
              <Bookmark size={18} />
              {!collapsed && 'Book Appointment'}
            </Link>

            <Link
              to="/patient/my-appointments"
              className={linkClass('/patient/my-appointments')}
            >
              <CalendarDays size={18} />
              {!collapsed && 'My Appointments'}
            </Link>

            <Link
              to="/patient/timeline"
              className={linkClass('/patient/timeline')}
            >
              <Clock size={18} />
              {!collapsed && 'Medical Timeline'}
            </Link>
          </>
        )}
      </nav>
    </aside>
    </>
  );
}
