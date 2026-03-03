import { Router } from 'express';
import * as controller from '../controllers/clinical.controller';
import { createConsultationNoteSchema } from '../validators/clinical.validator';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/rbac.middleware';
import { validateBody } from '../middlewares/validate.middleware';

const router = Router();

router.post(
  '/notes',
  authenticate,
  authorizeRole('doctor'),
  validateBody(createConsultationNoteSchema),
  controller.createConsultationNote
);

router.get('/notes/:appointmentId', authenticate, controller.getNotes);

export default router;
