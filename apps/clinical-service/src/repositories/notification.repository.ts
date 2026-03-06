import { Notification } from '../models/external/notification.model';

export const findUserNotifications = async (
  userId: string,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await Notification.findAndCountAll({
    where: { userId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    total: count,
    page,
    limit,
    notifications: rows,
  };
};
