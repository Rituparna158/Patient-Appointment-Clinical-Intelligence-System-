export type NotificationType = 'reminder' | 'follow_up' | 'missed';

export type NotificationStatus = 'pending' | 'sent' | 'failed';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  status: NotificationStatus;
  scheduledAt: string;
  sentAt: string | null;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
}

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
}
