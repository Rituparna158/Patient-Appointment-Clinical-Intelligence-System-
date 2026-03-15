import dotenv from 'dotenv';

dotenv.config();
import app from './app';
import './models';
import { sequelize } from './config/database';
//import './schedulers/appointment.scheduler';

const PORT = process.env.PORT || 4006;
const startServer = async () => {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log('Database connected');
      break;
    } catch (err) {
      console.log('DB not ready, retrying in 5 seconds...');
      retries--;
      await new Promise((res) => setTimeout(res, 5000));
      //console.error('DB connection failed:', err);
    }
  }
  app.listen(PORT, () => {
    console.log(`Appointment service is running on port ${PORT}`);
  });
};
startServer();
