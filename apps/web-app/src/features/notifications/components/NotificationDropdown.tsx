import NotificationItem from "./NotificationItem"
import { useNotifications } from "../hooks/useNotifications"

export default function NotificationDropdown() {

  const { notifications, loading } = useNotifications()

  if (loading) {
    return (
      <div className="notification-dropdown">
        Loading notifications...
      </div>
    )
  }

  return (

    <div className="notification-dropdown">

      <div className="notification-header">
        Notifications
      </div>

      {notifications.length === 0 && (
        <div className="notification-empty">
          No notifications
        </div>
      )}

      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
        />
      ))}

    </div>

  )
}