
import type { Notification } from "../../../types/notification.types"

export default function NotificationItem({ notification }: { notification: Notification }) {

  const formattedDate = new Date(
    notification.scheduledAt
  ).toLocaleString()

  return (

    <div className="notification-item">

      <p className="notification-message">
        {notification.message}
      </p>

      <span className="notification-date">
        {formattedDate}
      </span>

    </div>

  )
}