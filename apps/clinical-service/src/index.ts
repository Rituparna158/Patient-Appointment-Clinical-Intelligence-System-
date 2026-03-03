import dotenv from 'dotenv';

dotenv.config();
import app from './app';
import { sequelize } from './config/database';

const PORT = process.env.PORT || 4004;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    app.listen(PORT, () => {
      console.log(`Clinical Record service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('DB connection failed:', err);
  }
};
startServer();
