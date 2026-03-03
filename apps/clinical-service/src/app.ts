import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { globalRateLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandler } from './middlewares/error.middleware';
import healthRoutes from './routes/health-clinical.routes';
import clinicalRoutes from './routes/clinical.routes';

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(globalRateLimiter);
app.use(express.json());
app.use(cookieParser());
app.use('/api/clinical/health-clinical', healthRoutes);
app.use('/api/clinical', clinicalRoutes);
app.use(errorHandler);
export default app;
