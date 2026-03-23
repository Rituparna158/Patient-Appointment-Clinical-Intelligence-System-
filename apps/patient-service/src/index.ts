import dotenv from 'dotenv';

dotenv.config();
import app from './app';
import '@repo/shared-database';
import { sequelize } from './config/database';
import { logger } from '@repo/shared-utils';

const PORT = process.env.PORT || 4002;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    app.listen(PORT, () => {
      logger.info(`Patient service is running on port ${PORT}`);
    });
  } catch (err) {
    logger.error({ err }, 'DB connection failed');
  }
};
startServer();
