import dotenv from 'dotenv';
dotenv.config();

import './models';
import { sequelize } from './config/database';
import { startScheduler } from './schedulers/master.scheduler';

import './queues/appointment.consumer';
import './queues/clinical.consumer';

import { app } from './app';

const PORT = process.env.PORT || 4005;

const startWorker = async () => {
  try {
    await sequelize.authenticate();
    console.log('Worker DB connected');

    startScheduler();
    app.listen(PORT, () => {
      console.log(`Worker HTPP server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('worker failed to start:', error);
    process.exit(1);
  }
};
startWorker();
