import { Router } from 'express';
import * as controller from '../controllers/export.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAnyRole } from '../middlewares/role.middleware';
import { exportQuerySchema } from '../validators/export.validator';
import { validateQuery } from '../middlewares/validate.middleware';
import { authorizeRole } from '../middlewares/rbac.middleware';

const router = Router();

router.get(
  '/export',
  authenticate,
  requireAnyRole(['admin', 'doctor']),
  validateQuery(exportQuerySchema),
  controller.exportAnalytics
);

export default router;
