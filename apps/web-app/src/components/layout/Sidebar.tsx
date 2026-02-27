import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth/auth.store";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  CalendarDays,
  Menu,
  Bookmark,
  CalendarPlus2
} from "lucide-react";

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  const linkClass = (path: string) =>
    `sidebar-link ${
      isActive(path)
        ? "sidebar-link-active"
        : "sidebar-link-hover"
    }`;

  return (
    <aside
      className={`sidebar ${
        collapsed ? "sidebar-collapsed" : "sidebar-expanded"
      }`}
    >
      {/* Header */}
      <div className="sidebar-header justify-between">
        {!collapsed && (
          <span className="sidebar-title">
            Clinical System
          </span>
        )}

        <button onClick={() => setCollapsed(!collapsed)}>
          <Menu size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">

        {/* ================= ADMIN ================= */}
        {user?.role === "admin" && (
          <>
            <Link
              to="/admin/dashboard"
              className={linkClass("/admin/dashboard")}
            >
              <LayoutDashboard size={18} />
              {!collapsed && "Dashboard"}
            </Link>

            <Link
              to="/admin/create-doctor"
              className={linkClass("/admin/create-doctor")}
            >
              <UserPlus size={18} />
              {!collapsed && "Create Doctor"}
            </Link>

            <Link
              to="/admin/create-admin"
              className={linkClass("/admin/create-admin")}
            >
                 <Users size={18} />
              {!collapsed && "Create Admin"}
            </Link>

            <Link
                to="/admin/patient"
                className={linkClass("/admin/patient")}
                >
                    <Users size={18} />
                    {!collapsed && "Patients"}
                </Link>

            <Link
                to="/admin/appointments"
                className={linkClass("/admin/appointments")}
                >
                    <Bookmark size={18} />
                    {!collapsed && "Appointments"}
                </Link>

            <Link
                to="/admin/create-slot"
                className={linkClass("/admin/create-slot")}
                >
                    <CalendarPlus2 size={18} />
                    {!collapsed && "Create Slot"}
            </Link>
             
          </>
        )}

        {/* ================= DOCTOR ================= */}
        {user?.role === "doctor" && (
          <>
            <Link
              to="/doctor/dashboard"
              className={linkClass("/doctor/dashboard")}
            >
              <LayoutDashboard size={18} />
              {!collapsed && "Dashboard"}
            </Link>

            <Link
              to="/doctor/appointments"
              className={linkClass("/doctor/appointments")}
            >
              <CalendarDays size={18} />
              {!collapsed && "Appointments"}
            </Link>

            
          </>
        )}

        {/* ================= PATIENT ================= */}
        {user?.role === "patient" && (
          <>
            <Link
              to="/patient/dashboard"
              className={linkClass("/patient/dashboard")}
            >
              <LayoutDashboard size={18} />
              {!collapsed && "Dashboard"}
            </Link>

            {/* <Link
              to="/appointments"
              className={linkClass("/appointments")}
            >
              <CalendarDays size={18} />
              {!collapsed && "My Appointments"}
            </Link> */}

            <Link
                to="/patient/profile"
                className={linkClass("/patient/profile")}
            >
                <Users size={18} />
                {!collapsed && "My Profile"}

                </Link>

                <Link
                    to="/patient/book-appointment"
                    className={linkClass("/patient/book-appointment")}
                    >
                        <Bookmark size={18} />
                        {!collapsed && "Book Appointment"}
                </Link>

                <Link
                    to="/patient/my-appointments"
                    className={linkClass("/patient/my-appointments")}
                    >
                        <CalendarDays size={18} />
                        {!collapsed && "My Appointments"}
                </Link>
          </>
        )}

      </nav>
    </aside>
  );
}