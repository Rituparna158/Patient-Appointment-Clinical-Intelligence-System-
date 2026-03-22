import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/api', () => ({
  api: vi.fn(),
}));

import { api } from '@/services/api';
import { getMyNotifications } from '@/services/notification.service';

describe('Notification Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch notifications', async () => {
    vi.mocked(api).mockResolvedValue({
      data: {
        notifications: [
          {
            id: '1',
            type: 'reminder',
            message: 'Test',
            status: 'pending',
            scheduledAt: new Date().toISOString(),
            sentAt: null,
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      },
    });

    const res = await getMyNotifications();

    expect(res.notifications.length).toBe(1);
  });

  it('should fail notifications', async () => {
    vi.mocked(api).mockRejectedValue(new Error('Error'));

    await expect(getMyNotifications()).rejects.toThrow('Error');
  });
});
