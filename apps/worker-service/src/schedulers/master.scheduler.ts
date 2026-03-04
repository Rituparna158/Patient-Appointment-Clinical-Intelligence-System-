import cron from 'node-cron';

import { cancelUnpaidAppointments } from '../jobs/appointment-expiry.job';
import { markMissedAppointments } from '../jobs/appointment-missed.job';
import { processNotification } from '../jobs/notification.job';

export const startScheduler = () => {
  cron.schedule('* * * * *', async () => {
    console.log('worker tick.......');

    await cancelUnpaidAppointments();
    await markMissedAppointments();
    await processNotification();
  });
};
