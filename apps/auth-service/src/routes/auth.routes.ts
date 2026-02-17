import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { reuireRole, requireAnyRole } from '../middleware/role.middleware';
import {
  register,
  login,
  refreshToken,
  logout,
  me,
} from '../controllers/auth.controller';
import { HTTP_STATUS } from '../constants/http-status';
import { ROLES } from '../constants/roles';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.get('/doctor-only', requireAuth, reuireRole('doctor'), (req, res) => {
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
export default router;
