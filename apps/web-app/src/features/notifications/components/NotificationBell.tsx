import { useState } from "react"
import NotificationDropdown from "./NotificationDropdown"
import { useNotificationStore } from "../../../store/notification/notification.store"

export default function NotificationBell() {

  const [open, setOpen] = useState(false)

  const notifications = useNotificationStore(
    (state) => state.notifications
  )

  const toggleDropdown = () => {
    setOpen(!open)
  }

  return (

    <div className="notification-container">

      <button
        onClick={toggleDropdown}
        className="notification-bell"
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
