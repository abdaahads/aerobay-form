import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { validateLogin, handleValidationErrors } from '../middleware/validation.js';

const router = Router();

router.post('/login', validateLogin, handleValidationErrors, authController.login);

export default router;
