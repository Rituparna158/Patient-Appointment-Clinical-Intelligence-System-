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
  createBranchSchema,
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

router.post(
  '/pay',
  authenticate,
  authorizeRole('patient'),
  validateBody(confirmPaymentSchema),
  controller.confirmPayment
);

router.get(
  '/me',
  authenticate,
  authorizeRole('patient'),
  validateQuery(paginationQuerySchema),
  controller.getMyAppointments
);

router.get(
  '/doctor/me',
  authenticate,
  authorizeRole('doctor'),
  validateQuery(paginationQuerySchema),
  controller.getDoctorAppointments
);

router.patch(
  '/:id/status',
  authenticate,
  authorizeRole('doctor'),
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

router.post(
  '/',
  authenticate,
  authorizePermission('manage_appointments'),
  validateBody(createBranchSchema),
  controller.createBranch
);

router.get(
  '/doctors',
  authenticate,
  authorizePermission('manage_appointments'),
  controller.getAllDoctors
);

router.get(
  '/branches',
  authenticate,
  authorizePermission('manage_appointments'),
  controller.getAllBranches
);

router.patch(
  '/:id/cancel-refund',
  authenticate,
  authorizeRole('doctor'),
  controller.cancelWithRefund
);

router.patch(
  '/:id/reschedule',
  authenticate,
  authorizeRole('doctor'),
  controller.reschedule
);

export default router;
