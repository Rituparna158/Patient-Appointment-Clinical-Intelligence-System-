import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
  return res.status(200).json({
    service: 'appointment-service',
    status: 'running',
  });
});
export default router;
