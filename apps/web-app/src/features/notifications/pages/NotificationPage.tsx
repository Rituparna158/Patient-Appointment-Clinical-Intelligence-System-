import NotificationItem from "../components/NotificationItem"
import { useNotifications } from "../hooks/useNotifications"

export default function NotificationsPage() {

  const { notifications, loading } = useNotifications()

  if (loading) {
    return <div>Loading...</div>
  }

  return (

    <div className="notifications-page">

      <h2 className="notifications-title">
        Notifications
      </h2>

      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
        />
      ))}

    </div>

  )
}

