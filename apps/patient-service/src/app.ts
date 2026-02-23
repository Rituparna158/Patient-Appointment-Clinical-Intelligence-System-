import express from 'express';
import healthRoutes from './routes/health-patient.routes';

const app = express();
app.use(express.json());
app.use('/api/patient/health-patient', healthRoutes);
export default app;
