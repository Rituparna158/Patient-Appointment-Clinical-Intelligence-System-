import * as notificationRepo from '../repositories/notification.repository';

export const getMyNotifications = async (
  userId: string,
  page: number,
  limit: number
) => {
  return notificationRepo.findUserNotifications(userId, page, limit);
};
