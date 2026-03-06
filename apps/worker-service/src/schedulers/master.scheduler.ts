import cron from 'node-cron';

import { cancelUnpaidAppointments } from '../jobs/cron-jobs/appointment-expiry.job';
import { markMissedAppointments } from '../jobs/cron-jobs/appointment-missed.job';
import { processNotification } from '../jobs/cron-jobs/notification.job';

export const startScheduler = () => {
  cron.schedule('* * * * *', async () => {
    console.log('worker tick.......');

    await cancelUnpaidAppointments();
    await markMissedAppointments();
    await processNotification();
  });
};
