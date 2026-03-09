import { useEffect } from 'react';
import { useNotificationStore } from '../../../store/notification/notification.store';

export const useNotifications = () => {
  const notifications = useNotificationStore((state) => state.notifications);

  const loading = useNotificationStore((state) => state.loading);

  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, loading };
};
