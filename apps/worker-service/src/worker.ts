import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from './config/database';
import { app } from './app';
import { startScheduler } from './schedulers/master.scheduler';

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
