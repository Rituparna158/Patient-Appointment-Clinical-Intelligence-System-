import dotenv from 'dotenv';

dotenv.config();
import app from './app';
import '@repo/shared-database';
import { sequelize } from './config/database';
import { logger } from '@repo/shared-utils';

const PORT = process.env.PORT || 4006;
const startServer = async () => {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      logger.info('Database connected');
      break;
    } catch (err) {
      logger.info('DB not ready, retrying in 5 seconds...');
      retries--;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  app.listen(PORT, () => {
    logger.info(`Appointment service is running on port ${PORT}`);
  });
};
startServer();
