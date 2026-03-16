import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  loginLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from '@repo/shared-middleware';
import { requireRole, requireAnyRole } from '../middleware/role.middleware';
import {
  register,
  login,
  refreshTok,
  logout,
  me,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { HTTP_STATUS } from '@repo/shared-constants';

const router = Router();
router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/refresh', refreshTok);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.get('/patient-only', requireAuth, requireRole('patient'), (req, res) => {
  return res.status(HTTP_STATUS.OK).json({
    message: 'Welcome Patient',
  });
});
router.get('/doctor-only', requireAuth, requireRole('doctor'), (req, res) => {
  return res.status(HTTP_STATUS.OK).json({
    message: 'Welcome Doctor',
  });
});
router.get(
  '/staff-only',
  requireAuth,
  requireAnyRole(['doctor', 'admin']),
  (req, res) => {
    return res.status(HTTP_STATUS.OK).json({
      message: 'Welcome Staff',
    });
  }
);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPasswordLimiter, resetPassword);
export default router;
