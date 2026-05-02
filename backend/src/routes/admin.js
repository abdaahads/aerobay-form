/**
 * ── Admin Routes ──
 *
 * Maps HTTP methods + paths to the admin controller handlers.
 * All routes are prefixed with /api/admin (set in app.js).
 *
 * ⚠️ CRITICAL SECURITY ISSUE:
 *   The authenticateToken middleware is DISABLED (line 8 is commented out).
 *   This means ALL admin endpoints — including DELETE and UPDATE — are
 *   publicly accessible without any authentication.
 *
 *   TO FIX: Uncomment line 8 before deploying to production.
 *   This will require a valid JWT Bearer token in the Authorization header.
 *
 * ROUTE ORDER MATTERS:
 *   /submissions/export/csv MUST come before /submissions/:id
 *   Otherwise Express will interpret "export" as an :id parameter.
 */

import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Apply auth middleware to all admin routes (DISABLED FOR NOW)
// router.use(authenticateToken);

// ── Dashboard ──
router.get('/dashboard/stats', adminController.getDashboardStats);

// ── Submissions CRUD ──
router.get('/submissions/export/csv', adminController.exportCSV);   // Must be before :id route
router.get('/submissions', adminController.getSubmissions);          // Paginated list
router.get('/submissions/:id', adminController.getSubmission);       // Single submission
router.put('/submissions/:id', adminController.updateSubmission);    // Edit or append shipments
router.delete('/submissions/:id', adminController.deleteSubmission); // Hard delete

export default router;
