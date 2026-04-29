import { Router } from 'express';
import { formController } from '../controllers/formController.js';
import { validateFormSubmission, handleValidationErrors } from '../middleware/validation.js';

const router = Router();

router.post('/submit', validateFormSubmission, handleValidationErrors, formController.submitForm);
router.get('/categories', formController.getCategories);

export default router;
