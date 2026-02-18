import { Router } from 'express';
import { createDoctor, createAdmin } from '../controllers/admin.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';

const router = Router();

router.post(
  '/create-doctor',
  requireAuth,
  requirePermission('create_doctors'),
  createDoctor
);

router.post(
  '/create-admin',
  requireAuth,
  requirePermission('create_admin'),
  createAdmin
);
export default router;
