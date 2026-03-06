import { Op } from 'sequelize';
import { Notification } from '../../models/external/notification.model';

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
    console.log(
      `Sending ${notification.type} notification to ${notification.userId}`
    );
    notification.status = 'sent';
    await notification.save();
  }
};
