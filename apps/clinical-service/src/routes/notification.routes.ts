import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as controller from '../controllers/notification.controller';

const router = Router();

router.get('/me', authenticate, controller.getMyNotifications);

export default router;
