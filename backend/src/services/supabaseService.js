/**
 * ── Supabase Service ──
 *
 * Data access layer for all Supabase (PostgreSQL) operations.
 * This is the ONLY file that talks to the database — all controllers
 * go through this service. This makes it easy to swap databases later.
 *
 * AUTHENTICATION:
 *   Uses the Service Role Key (not the anon key) to bypass Row-Level Security.
 *   This is appropriate for a backend service but NEVER expose this key
 *   to the frontend or commit it to version control.
 *
 * ERROR HANDLING:
 *   All methods catch Supabase errors, log them via the logger, and re-throw.
 *   The calling controller's next(error) will then pass them to the global
 *   error handler middleware.
 *
 * TABLE: form_submissions
 *   See backend/schema.sql for the full column definitions and constraints.
 */

import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

// ── Supabase Client Initialization ──────────────────────────────────────────

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.warn('Supabase URL or Key is missing. Database operations will fail.');
}

/**
 * Initialize with placeholder values if env vars are missing.
 * This prevents a crash at import time but operations will fail at runtime.
 * The warn log above alerts developers to the misconfiguration.
 */
const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

// ── Service Methods ─────────────────────────────────────────────────────────

export const supabaseService = {
  /**
   * Insert a new form submission.
   * Called by formController.submitForm() after mapping camelCase → snake_case.
   * Returns the full inserted row (via .select().single()).
   */
  async insertSubmission(data) {
    try {
      const { data: insertedData, error } = await supabase
        .from('form_submissions')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return insertedData;
    } catch (error) {
      logger.error('Supabase insert failed', { error: error.message });
      throw error;
    }
  },

  /**
   * Update an existing submission by UUID.
   * Accepts any subset of columns — Supabase only updates the fields you pass.
   * Used for both form edits AND shipment appends.
   *
   * SECURITY NOTE: No field allowlist is applied here. The controller should
   * sanitize req.body before calling this to prevent overwriting sensitive
   * columns like sync_status or ip_address.
   */
  async updateSubmission(id, data) {
    try {
      const { data: updatedData, error } = await supabase
        .from('form_submissions')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    } catch (error) {
      logger.error('Supabase update failed', { id, error: error.message });
      throw error;
    }
  },

  /**
   * Fetch paginated submissions with optional filters.
   * Uses Supabase's .range() for offset-based pagination.
   * Returns { submissions, total } where total is the exact count (for pagination UI).
   *
   * Filter behavior:
   *   - category: exact match on lab_category
   *   - dateFrom: created_at >= dateFrom
   *   - dateTo: created_at <= dateTo (end-of-day inclusive)
   */
  async getSubmissions({ limit = 15, offset = 0, category, dateFrom, dateTo }) {
    try {
      let query = supabase
        .from('form_submissions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (category) query = query.eq('lab_category', category);
      if (dateFrom) query = query.gte('created_at', dateFrom);
      if (dateTo) query = query.lte('created_at', `${dateTo}T23:59:59.999Z`);

      const { data, count, error } = await query;
      if (error) throw error;

      return { submissions: data, total: count };
    } catch (error) {
      logger.error('Supabase getSubmissions failed', { error: error.message });
      throw error;
    }
  },

  /**
   * Fetch a single submission by its UUID.
   * Returns null-ish if not found (Supabase throws on .single() with no match,
   * so the controller should handle the error case).
   */
  async getSubmissionById(id) {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Supabase getSubmissionById failed', { id, error: error.message });
      throw error;
    }
  },

  /**
   * Permanently delete a submission by UUID.
   * This is a HARD DELETE — the row is gone forever.
   * Consider soft-delete (setting is_deleted = true) for production audit trails.
   */
  async deleteSubmission(id) {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Supabase delete failed', { id, error: error.message });
      throw error;
    }
  },

  /**
   * Get aggregate statistics for the dashboard.
   *
   * PERFORMANCE NOTE:
   *   This makes 5 separate queries (1 total + 4 per-category).
   *   At low volume (~100s of rows) this is fine. At scale, replace with
   *   a single Supabase RPC (PostgreSQL function) that does:
   *     SELECT lab_category, COUNT(*) FROM form_submissions GROUP BY lab_category
   */
  async getStats() {
    try {
      // Total count across all categories
      const { count: totalSubmissions, error: totalError } = await supabase
        .from('form_submissions')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Per-category counts (4 fixed categories)
      const categories = ['Basix', 'Standard', 'Advanced', 'Premium'];
      const byCategory = {};
      
      for (const cat of categories) {
        const { count } = await supabase
          .from('form_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('lab_category', cat);
        byCategory[cat] = count || 0;
      }

      return {
        totalSubmissions: totalSubmissions || 0,
        byCategory
      };
    } catch (error) {
      logger.error('Supabase getStats failed', { error: error.message });
      throw error;
    }
  }
};
