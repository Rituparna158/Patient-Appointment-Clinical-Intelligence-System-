import express from 'express';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
const swaggerDocument = YAML.load('src/swagger.yaml');
console.log('swagger loaded:', swaggerDocument.info.title);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);
export default app;
