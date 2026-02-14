import express from 'express';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler } from './middleware/error.middleware';

//import swaggerUi from 'swagger-ui-express';
//import YAML from 'yamljs';
import path from 'path';
import { he } from 'zod/v4/locales';

const app = express();
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);
/*const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));*/
export default app;
