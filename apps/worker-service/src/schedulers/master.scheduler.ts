import cron from 'node-cron';

import { cancelUnpaidAppointments } from '../jobs/cron-jobs/appointment-expiry.job';
import { markMissedAppointments } from '../jobs/cron-jobs/appointment-missed.job';
import { processNotification } from '../jobs/cron-jobs/notification.job';
import { generateDailyAnalytics } from '../jobs/cron-jobs/analytics.job';
import { logger } from '@repo/shared-utils';
export const startScheduler = () => {
  cron.schedule('* * * * *', async () => {
    logger.info('worker tick.......');

    await cancelUnpaidAppointments();
    await markMissedAppointments();
    await processNotification();
  });

  cron.schedule('0 0 * * *', async () => {
    await generateDailyAnalytics();
  });

  logger.info('Scheduler started for daily analytics');
};
