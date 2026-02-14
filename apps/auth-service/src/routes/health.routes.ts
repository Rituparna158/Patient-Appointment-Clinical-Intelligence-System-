import { Router } from 'express';
import { HTTP_STATUS } from '../constants/http-status';

const router = Router();
router.get('/', (req, res) => {
  return res.status(HTTP_STATUS.OK).json({
    service: 'auth-service',
    status: 'running',
  });
});
export default router;
