import { Op } from 'sequelize';
import { Notification } from '@repo/shared-database';
import { logger } from '@repo/shared-utils';

export const processNotification = async () => {
  const now = new Date();

  const pendingNotifications = await Notification.findAll({
    where: {
      status: 'pending',
      scheduledAt: {
        [Op.lte]: now,
      },
    },
  });

  for (const notification of pendingNotifications) {
    logger.info(
      `Sending ${notification.type} notification to ${notification.userId}`
    );
    notification.status = 'sent';
    await notification.save();
  }
};
