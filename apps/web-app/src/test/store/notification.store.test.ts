import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/notification.service', () => ({
  getMyNotifications: vi.fn(),
}));

import { useNotificationStore } from '@/store/notification/notification.store';
import { getMyNotifications } from '@/services/notification.service';
import type { NotificationResponse } from '@/types/notification.types';

describe('Notification Store', () => {
  beforeEach(() => {
    useNotificationStore.setState({
      notifications: [],
      loading: false,
    });
  });

  it('should fetch notifications', async () => {
    const mockResponse: NotificationResponse = {
      notifications: [
        {
          id: '1',
          message: 'Test notification',
          type: 'reminder',
          status: 'pending',
          scheduledAt: new Date().toISOString(),
          sentAt: null,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    };

    vi.mocked(getMyNotifications).mockResolvedValue(mockResponse);

    const store = useNotificationStore.getState();

    await store.fetchNotifications();

    expect(getMyNotifications).toHaveBeenCalled();
    expect(useNotificationStore.getState().notifications.length).toBe(1);
  });
});
