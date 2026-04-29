import { body, validationResult } from 'express-validator';
import { LAB_CATEGORIES } from '../utils/constants.js';

export const validateFormSubmission = [
  body('schoolInfo.schoolName').trim().notEmpty().withMessage('School name is required'),
  body('schoolInfo.contactPerson').trim().notEmpty().withMessage('Contact person is required'),
  body('schoolInfo.contactEmail').trim().isEmail().withMessage('Valid email is required'),
  body('schoolInfo.contactPhone').optional().trim(),
  body('schoolInfo.schoolCode').optional().trim(),
  body('labCategory').isIn(LAB_CATEGORIES).withMessage('Valid lab category is required'),
  body('selectedItems').isArray().withMessage('Selected items must be an array'),
  body('customItems').isArray().withMessage('Custom items must be an array'),
  body('submittedBy.submitterName').trim().notEmpty().withMessage('Submitter name is required'),
  body('submittedBy.targetDate').optional().trim(),
  body('submittedBy.additionalNotes').optional().trim(),
];

export const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(e => e.msg),
    });
  }
  next();
}
