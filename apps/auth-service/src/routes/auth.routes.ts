import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { reuireRole, requireAnyRole } from '../middleware/role.middleware';
import { register, login, me } from '../controllers/auth.controller';
import { HTTP_STATUS } from '../constants/http-status';
import { ROLES } from '../constants/roles';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.get(
  '/doctor-only',
  requireAuth,
  reuireRole(ROLES.DOCTOR),
  (req, res) => {
    return res.status(HTTP_STATUS.OK).json({
      message: 'Welcome Doctor',
    });
  }
);
router.get(
  '/staff-only',
  requireAuth,
  requireAnyRole([ROLES.DOCTOR, ROLES.ADMIN]),
  (req, res) => {
    return res.status(HTTP_STATUS.OK).json({
      message: 'Welcome Staff',
    });
  }
);
export default router;
