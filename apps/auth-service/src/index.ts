import app from './app';
import { sequelize } from '../src/config/database';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync();
    console.log('Table synced');

    app.listen(PORT, () => {
      console.log(`Auth service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('DB connection failed:', err);
  }
};
startServer();
