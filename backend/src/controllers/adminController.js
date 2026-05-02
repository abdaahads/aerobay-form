/**
 * ── Admin Controller ──
 *
 * Handles all HTTP requests for the admin dashboard.
 * Each method follows the Express (req, res, next) pattern.
 * Errors are forwarded to the global error handler via next(error).
 *
 * SECURITY WARNING:
 *   The auth middleware is currently DISABLED in routes/admin.js.
 *   In production, ALL these endpoints should require a valid JWT.
 *   Without auth, anyone who discovers /api/admin/* can read, modify,
 *   or delete all submission data.
 *
 * INPUT VALIDATION WARNING:
 *   updateSubmission() passes req.body directly to Supabase without
 *   validating or sanitizing the fields. While Supabase has column-level
 *   type constraints, a malicious actor could overwrite unexpected fields
 *   (e.g. sync_status, ip_address). Consider adding an allowlist of
 *   updatable fields before going to production.
 */

import { supabaseService } from '../services/supabaseService.js';
import { SYNC_STATUS } from '../utils/constants.js';
import { AsyncParser } from 'json2csv';

export const adminController = {
  /**
   * GET /api/admin/submissions
   * Returns a paginated list of submissions with optional filters.
   * Query params: limit, offset, category, dateFrom, dateTo, syncStatus
   */
  async getSubmissions(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 15;
      const offset = parseInt(req.query.offset) || 0;
      const { category, dateFrom, dateTo, syncStatus } = req.query;

      const data = await supabaseService.getSubmissions({
        limit,
        offset,
        category,
        dateFrom,
        dateTo,
        syncStatus
      });

      res.json({
        success: true,
        submissions: data.submissions,
        total: data.total,
        page: Math.floor(offset / limit) + 1
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/submissions/:id
   * Returns a single submission by UUID.
   * Returns 404 if the submission doesn't exist.
   */
  async getSubmission(req, res, next) {
    try {
      const data = await supabaseService.getSubmissionById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Submission not found' });
      
      res.json({ success: true, submission: data });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/admin/submissions/:id
   * Updates a submission. Accepts any partial set of fields.
   *
   * Used for TWO purposes:
   *   1. Editing form fields (school_name, selected_items, etc.)
   *   2. Appending shipment records (shipments array)
   *
   * TODO: Add field allowlist to prevent overwriting sensitive columns
   *       like sync_status, ip_address, or user_agent.
   */
  async updateSubmission(req, res, next) {
    try {
      const data = await supabaseService.updateSubmission(req.params.id, req.body);
      res.json({ success: true, submission: data });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/admin/submissions/:id
   * Permanently removes a submission from the database.
   * Consider implementing soft-delete (is_deleted flag) for audit trails.
   */
  async deleteSubmission(req, res, next) {
    try {
      await supabaseService.deleteSubmission(req.params.id);
      res.json({ success: true, message: 'Submission deleted' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/dashboard/stats
   * Returns aggregate counts: total submissions + per-category breakdown.
   */
  async getDashboardStats(req, res, next) {
    try {
      const stats = await supabaseService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/submissions/export/csv
   * Exports submissions as a CSV file with optional filters.
   * Uses json2csv's AsyncParser for streaming large datasets.
   *
   * NOTE: The limit of 10000 is a pragmatic cap. For truly large datasets,
   * consider server-side streaming or paginated export.
   */
  async exportCSV(req, res, next) {
    try {
      const { category, dateFrom, dateTo } = req.query;
      
      // Get all records matching filters (high limit acts as "all")
      const data = await supabaseService.getSubmissions({
        limit: 10000,
        offset: 0,
        category,
        dateFrom,
        dateTo
      });

      const fields = [
        'submission_date', 'school_name', 'school_code', 'contact_person',
        'contact_email', 'contact_phone', 'lab_category', 'submitted_by_name',
        'target_date'
      ];
      
      const opts = { fields };
      const parser = new AsyncParser(opts);
      const csv = await parser.parse(data.submissions).promise();

      res.header('Content-Type', 'text/csv');
      res.attachment(`submissions_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }
};
