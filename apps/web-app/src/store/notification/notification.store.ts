import { create } from 'zustand';
import type { NotificationState } from '../../types/notification.types';
import { getMyNotifications } from '../../services/notification.service';

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });

    const result = await getMyNotifications();

    set({
      notifications: result.notifications,
      loading: false,
    });
  },
}));
