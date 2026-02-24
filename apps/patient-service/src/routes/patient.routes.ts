import { Router } from 'express';
import * as controller from '../controllers/patient.controller';

import { authenticate } from '../middlewares/auth.middleware';
import {
  authorizeRole,
  authorizePermission,
} from '../middlewares/rbac.middleware';

import {
  validateBody,
  validateQuery,
} from '../middlewares/validate.middleware';

import {
  createPatientSchema,
  updatePatientSchema,
  searchPatientSchema,
} from '../validators/patient.validators';

const router = Router();

router.post(
  '/profile',
  authenticate,
  authorizeRole('patient'),
  validateBody(createPatientSchema),
  controller.createProfile
);

router.get(
  '/me',
  authenticate,
  authorizeRole('patient'),
  controller.getProfile
);

router.put(
  '/me',
  authenticate,
  authorizeRole('patient'),
  validateBody(updatePatientSchema),
  controller.updateProfile
);

router.delete(
  '/me',
  authenticate,
  authorizeRole('patient'),
  controller.deleteProfile
);

router.get(
  '/',
  authenticate,
  authorizePermission('manage_users'),
  validateQuery(searchPatientSchema),
  controller.adminSearch
);

export default router;
