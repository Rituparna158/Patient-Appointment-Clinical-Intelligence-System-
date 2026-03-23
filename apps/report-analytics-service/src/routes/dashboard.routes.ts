import { Router } from 'express';
import * as controller from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/rbac.middleware';
import {
  analyticsTableQuerySchema,
  doctorTableQuerySchema,
  patientTableQuerySchema,
  trendQuerySchema,
} from '../validators/dashboard.validator';
import { validateQuery } from '@repo/shared-middleware';
const router = Router();

router.get(
  '/admin/dashboard/counters',
  authenticate,
  authorizeRole('admin'),
  controller.getCounters
);

router.get(
  '/admin/dashboard/status',
  authenticate,
  authorizeRole('admin'),
  controller.getAppointmentStatus
);

router.get(
  '/admin/dashboard/trend',
  authenticate,
  authorizeRole('admin'),
  validateQuery(trendQuerySchema),
  controller.getAppointmentTrend
);

router.get(
  '/admin/dashboard/daily',
  authenticate,
  authorizeRole('admin'),
  validateQuery(analyticsTableQuerySchema),
  controller.getDailyAnalytics
);

router.get(
  '/doctor/dashboard',
  authenticate,
  authorizeRole('doctor'),
  controller.doctorDashboard
);

router.get(
  '/doctor/dashboard/table',
  authenticate,
  authorizeRole('doctor'),
  validateQuery(doctorTableQuerySchema),
  controller.doctorAppointmentsTable
);

router.get(
  '/doctor/charts/workload',
  authenticate,
  authorizeRole('doctor'),
  controller.doctorWorkloadTrend
);

router.get(
  '/doctor/charts/completion-rate',
  authenticate,
  authorizeRole('doctor'),
  controller.doctorCompletionRate
);

router.get(
  '/doctor/charts/patient-types',
  authenticate,
  authorizeRole('doctor'),
  controller.doctorPatientTypes
);

router.get(
  '/patient/dashboard',
  authenticate,
  authorizeRole('patient'),
  controller.patientDashboard
);

router.get(
  '/patient/dashboard/table',
  authenticate,
  authorizeRole('patient'),
  validateQuery(patientTableQuerySchema),
  controller.patientAppointmentsTable
);

export default router;
