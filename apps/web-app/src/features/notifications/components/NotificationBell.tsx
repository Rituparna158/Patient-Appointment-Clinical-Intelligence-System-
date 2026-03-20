import { useEffect, useRef, useState } from "react"
import NotificationDropdown from "./NotificationDropdown"
import { useNotificationStore } from "../../../store/notification/notification.store"

export default function NotificationBell() {

  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const notifications = useNotificationStore(
    (state) => state.notifications
  )

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

    <div className="notification-container" ref={containerRef}>

      <button
        onClick={toggleDropdown}
        className="notification-bell"
        aria-label="open notifications"
      >
        🔔
      </button>

      {notifications.length > 0 && (
        <span className="notification-badge">
          {notifications.length}
        </span>
      )}

      {open && <NotificationDropdown />}

    </div>

  )
}
