import { Router } from 'express';
import * as controller from '../controllers/export.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAnyRole } from '@repo/shared-middleware';
import { exportQuerySchema } from '../validators/export.validator';
import { validateQuery } from '@repo/shared-middleware';

const router = Router();

router.get(
  '/export',
  authenticate,
  requireAnyRole(['admin', 'doctor']),
  validateQuery(exportQuerySchema),
  controller.exportAnalytics
);

export default router;
