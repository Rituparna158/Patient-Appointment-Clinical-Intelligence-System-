import { Router } from 'express';
import * as controller from '../controllers/export.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/rbac.middleware';
import { exportQuerySchema } from '../validators/export.validator';
import { validateQuery } from '../middlewares/validate.middleware';

const router = Router();

router.get(
  '/export',
  authenticate,
  validateQuery(exportQuerySchema),
  controller.exportAnalytics
);

export default router;
