import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Apply auth middleware to all admin routes
router.use(authenticateToken);

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/submissions/export/csv', adminController.exportCSV);
router.get('/submissions', adminController.getSubmissions);
router.get('/submissions/:id', adminController.getSubmission);
router.put('/submissions/:id', adminController.updateSubmission);
router.delete('/submissions/:id', adminController.deleteSubmission);
router.post('/submissions/:id/retry-sync', adminController.retrySync);

export default router;
