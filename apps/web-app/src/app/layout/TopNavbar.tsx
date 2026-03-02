import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/auth.store";
import { AuthService } from "@/services/auth.service";
import { Bell, Moon, Sun, ChevronDown } from "lucide-react";

export default function TopNavbar() {
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await AuthService.logout();
    logoutStore();
    navigate("/login");
  }

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  }

  return (
    <header className="navbar sticky top-0 z-50">
      <div className="navbar-left">
        <h1 className="navbar-title">
          Clinical Intelligence System
        </h1>

        {user?.role && (
          <span className="role-badge">
            {user.role.toUpperCase()}
          </span>
        )}
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn">
          <Bell size={18} />
        </button>

        <button onClick={toggleTheme} className="navbar-icon-btn">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2"
          >
            <span className="navbar-email">
              {user?.email}
            </span>
            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 dropdown-menu">
              <div
                className="dropdown-item"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
              >
                Profile
              </div>

              <div
                className="dropdown-item"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
