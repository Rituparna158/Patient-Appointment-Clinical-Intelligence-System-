import express from 'express';
import cookieParser from 'cookie-parser';
import healthRoutes from './routes/health-patient.routes';
import patientRoutes from './routes/patient.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/patient/health-patient', healthRoutes);
app.use('/api/patient', patientRoutes);
app.use(errorHandler);
export default app;
