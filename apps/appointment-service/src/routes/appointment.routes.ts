import { Router } from 'express';
import * as controller from '../controllers/appointment.controller';

import { authenticate } from '../middlewares/auth.middleware';
import {
  authorizeRole,
  authorizePermission,
} from '../middlewares/rbac.middleware';

import {
  bookAppointmentSchema,
  changeStatusSchema,
  confirmPaymentSchema,
  paginationQuerySchema,
  createSlotSchema,
} from '../validators/appointment.validator';
import {
  validateBody,
  validateQuery,
} from '../middlewares/validate.middleware';

const router = Router();

router.post(
  '/book',
  authenticate,
  authorizeRole('patient'),
  validateBody(bookAppointmentSchema),
  controller.bookAppointment
);

router.get(
  '/me',
  authenticate,
  authorizeRole('patient'),
  validateQuery(paginationQuerySchema),
  controller.getMyAppointments
);

router.get(
  '/doctor/:doctorId',
  authenticate,
  authorizeRole('doctor'),
  validateQuery(paginationQuerySchema),
  controller.getDoctorAppointments
);

router.patch(
  '/:id/status',
  authenticate,
  authorizePermission('manage_appointments'),
  validateBody(changeStatusSchema),
  controller.changeAppointmentStatus
);

router.patch(
  '/payment',
  authenticate,
  authorizePermission('manage_appointments'),
  validateBody(confirmPaymentSchema),
  controller.confirmPayment
);

router.get(
  '/',
  authenticate,
  authorizePermission('manage_appointments'),
  validateQuery(paginationQuerySchema),
  controller.adminSearchAppointments
);

router.get('/slots', authenticate, controller.getAvailableSlots);

router.post(
  '/admin/create-slot',
  authenticate,
  authorizePermission('manage_appointments'),
  validateBody(createSlotSchema),
  controller.createSlot
);

export default router;
