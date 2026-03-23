import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/auth.store";
import { AuthService } from "@/services/auth.service";
import { Moon, Sun, ChevronDown } from "lucide-react";
import NotificationBell from "@/features/notifications/components/NotificationBell";

export default function TopNavbar() {
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const role = user?.roles?.[0]

  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null)

  async function handleLogout() {
    await AuthService.logout();
    logoutStore();
    navigate("/login");
  }

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  return (
    <header className="navbar sticky top-0 z-50">
      <div className="navbar-left min-w-0">
        <h1 className="navbar-title truncate">
          Clinical Intelligence System
        </h1>

        {role && (
          <span className="role-badge hidden sm:inline">
            {role.toUpperCase()}
          </span>
        )}
      </div>

      <div className="navbar-right">

        <NotificationBell />
        <button
          onClick={toggleTheme}
          className="navbar-icon-btn"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2"
            aria-label="Open user menu"
          >
            <span className="navbar-email hidden sm:block">
              {user?.email}
            </span>
            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 sm:w-48 dropdown-menu">
              <button
                className="dropdown-item w-full text-left"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
              >
                Profile
              </button>

              <button
                className="dropdown-item w-full text-left"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
