import { api } from '@/services/api';
import type { NotificationResponse } from '../types/notification.types';

export const getMyNotifications = async (): Promise<NotificationResponse> => {
  const response = await api('/clinical/notification/me', {
    method: 'GET',
  });

  return response.data;
};
