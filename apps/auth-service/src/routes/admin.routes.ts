import { Router } from 'express';
import { createDoctor } from '../controllers/admin.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';

const router = Router();

router.post(
  '/create-doctor',
  requireAuth,
  requirePermission('create_doctors'),
  createDoctor
);
export default router;
