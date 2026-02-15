import { beforeAll } from 'vitest';
import { sequelize } from '../src/config/database';

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('test db connected');

    await sequelize.sync();
    console.log('tables created');
  } catch (err) {
    console.log('test db setup failed', err);
  }
});
