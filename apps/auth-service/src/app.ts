import express from 'express';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(
  cors({
    //origin: ['http://localhost:5173', 'http://localhost:8080'],
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
const swaggerFiles = [
  {
    url: '/swagger/auth',
    name: 'Auth Service',
  },
  {
    url: '/swagger/patient',
    name: 'Patient Service',
  },
  {
    url: '/swagger/appointment',
    name: 'Appointment Service',
  },
];

app.get('/swagger/auth', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, '../../../packages/swagger/auth.swagger.yaml')
  );
});

app.get('/swagger/patient', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, '../../../packages/swagger/patient.swagger.yaml')
  );
});

app.get('/swagger/appointment', (req, res) => {
  res.sendFile(
    path.resolve(
      __dirname,
      '../../../packages/swagger/appointment.swagger.yaml'
    )
  );
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(null, {
    explorer: true,
    swaggerOptions: {
      urls: swaggerFiles,
    },
  })
);
app.use(errorHandler);
export default app;
