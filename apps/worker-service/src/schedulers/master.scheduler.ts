import cron from 'node-cron';

import { cancelUnpaidAppointments } from '../jobs/cron-jobs/appointment-expiry.job';
import { markMissedAppointments } from '../jobs/cron-jobs/appointment-missed.job';
import { processNotification } from '../jobs/cron-jobs/notification.job';
import { publishDailyAnalytics } from '../queues/analytics.producer';
export const startScheduler = () => {
  cron.schedule('* * * * *', async () => {
    console.log('worker tick.......');

    await cancelUnpaidAppointments();
    await markMissedAppointments();
    await processNotification();
  });

  cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    console.log('Publishing daily analytics job for', dateStr);
    await publishDailyAnalytics(dateStr);
  });

  console.log('Scheduler started for daily analytics');
};
