import dotenv from 'dotenv';

dotenv.config();
import app from './app';
import { sequelize } from './config/database';
import '@repo/shared-database';
import { logger } from '@repo/shared-utils';

const PORT = process.env.PORT || 4001;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    app.listen(PORT, () => {
      logger.info(`Auth service is running on port ${PORT}`);
    });
  } catch (err) {
    logger.error({ err }, 'DB connection failed:');
  }
};
startServer();
