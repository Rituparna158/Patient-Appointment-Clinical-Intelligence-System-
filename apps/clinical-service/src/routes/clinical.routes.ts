import { Router } from 'express';
import * as controller from '../controllers/clinical.controller';
import {
  createConsultationNoteSchema,
  paginationQuerySchema,
  updateConsultationNoteSchema,
} from '../validators/clinical.validator';
import { authenticate } from '../middlewares/auth.middleware';
import {
  authorizePermission,
  authorizeRole,
} from '../middlewares/rbac.middleware';
import {
  validateBody,
  validateQuery,
} from '../middlewares/validate.middleware';

const router = Router();

router.post(
  '/notes',
  authenticate,
  authorizeRole('doctor'),
  validateBody(createConsultationNoteSchema),
  controller.createConsultationNote
);

/* Update Note */
router.patch(
  '/notes/:noteId',
  authenticate,
  authorizeRole('doctor'),
  validateBody(updateConsultationNoteSchema),
  controller.updateConsultationNote
);

/* Get Notes By Appointment */
router.get(
  '/notes/:appointmentId',
  authenticate,
  controller.getNotesByAppointment
);

/* Doctor Dashboard */
router.get(
  '/doctor/me',
  authenticate,
  authorizeRole('doctor'),
  validateQuery(paginationQuerySchema),
  controller.getDoctorConsultations
);

/* Patient Timeline */
router.get(
  '/patient/me',
  authenticate,
  authorizeRole('patient'),
  validateQuery(paginationQuerySchema),
  controller.getPatientTimeline
);

/* Admin View */
router.get(
  '/admin',
  authenticate,
  authorizePermission('manage_appointments'),
  validateQuery(paginationQuerySchema),
  controller.getAllClinicalRecords
);

export default router;
