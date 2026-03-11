import cron from 'node-cron';

import { cancelUnpaidAppointments } from '../jobs/cron-jobs/appointment-expiry.job';
import { markMissedAppointments } from '../jobs/cron-jobs/appointment-missed.job';
import { processNotification } from '../jobs/cron-jobs/notification.job';
import { generateDailyAnalytics } from '../jobs/cron-jobs/analytics.job';
export const startScheduler = () => {
  cron.schedule('* * * * *', async () => {
    console.log('worker tick.......');

    await cancelUnpaidAppointments();
    await markMissedAppointments();
    await processNotification();
  });

  cron.schedule('* * * * *', async () => {
    await generateDailyAnalytics();
  });

  console.log('Scheduler started for daily analytics');
};
