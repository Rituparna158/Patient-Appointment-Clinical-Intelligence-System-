import dotenv from 'dotenv';
dotenv.config();

import '@repo/shared-database';
import { sequelize } from './config/database';
import { startScheduler } from './schedulers/master.scheduler';

import './queues/appointment.consumer';
import './queues/clinical.consumer';
import './queues/export.consumer';

import { app } from './app';
import { logger } from '@repo/shared-utils';

const PORT = process.env.PORT || 4005;

const startWorker = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Worker DB connected');

    startScheduler();
    app.listen(PORT, () => {
      logger.info(`Worker HTPP server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ error }, 'worker failed to start:');
    process.exit(1);
  }
};
startWorker();
