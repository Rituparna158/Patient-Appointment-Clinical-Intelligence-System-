import { beforeAll } from 'vitest';
import { sequelize } from '../src/config/database';
import { logger } from '@repo/shared-utils';

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    logger.info('test db connected');

    await sequelize.sync();
    logger.info('tables created');
  } catch (err) {
    logger.info({ err }, 'test db setup failed');
  }
});
