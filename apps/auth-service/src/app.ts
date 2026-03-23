import express from 'express';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import adminRoutes from './routes/admin.routes';
import { globalRateLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler } from './middleware/error.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(globalRateLimiter);
app.use(corsMiddleware);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

const getSwaggerPath = (file: string) => {
  return path.join(process.cwd(), 'packages/swagger', file);
};

app.get('/swagger/auth', (req, res) => {
  res.sendFile(getSwaggerPath('auth.swagger.yaml'));
});

app.get('/swagger/patient', (req, res) => {
  res.sendFile(getSwaggerPath('patient.swagger.yaml'));
});

app.get('/swagger/appointment', (req, res) => {
  res.sendFile(getSwaggerPath('appointment.swagger.yaml'));
});

app.get('/swagger/report', (req, res) => {
  res.sendFile(getSwaggerPath('report-analytics.swagger.yaml'));
});

app.get('/swagger/clinical', (req, res) => {
  res.sendFile(getSwaggerPath('clinical.swagger.yaml'));
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(null, {
    explorer: true,
    swaggerOptions: {
      urls: [
        { url: '/swagger/auth', name: 'Auth Service' },
        { url: '/swagger/patient', name: 'Patient Service' },
        { url: '/swagger/appointment', name: 'Appointment Service' },
        { url: '/swagger/report', name: 'Report Service' },
        { url: '/swagger/clinical', name: 'Clinical Service' },
      ],
    },
  })
);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
