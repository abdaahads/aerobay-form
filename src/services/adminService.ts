/**
 * ── Admin Service (Frontend API Client) ──
 *
 * All HTTP calls from the Admin Dashboard go through this service.
 * Uses the shared `api` Axios instance (which handles base URL and auth headers).
 *
 * ENDPOINTS CONSUMED:
 *   GET    /api/admin/submissions          — paginated list with filters
 *   GET    /api/admin/submissions/:id      — single submission detail
 *   PUT    /api/admin/submissions/:id      — update submission (CRUD + shipments)
 *   DELETE /api/admin/submissions/:id      — hard delete
 *   GET    /api/admin/dashboard/stats      — aggregate counts
 *   GET    /api/admin/submissions/export/csv — CSV download
 *
 * NOTE: The PUT endpoint is used for BOTH editing form data AND appending
 * shipments. The backend's supabaseService.updateSubmission() accepts any
 * Partial<Submission> and passes it directly to Supabase's .update().
 */

import api from './api';
import type { SubmissionFilters, SubmissionsResponse, DashboardStats, Submission } from '../types';

export const adminService = {
  /**
   * Fetch paginated submissions with optional category and date range filters.
   * The backend handles the Supabase query construction and pagination math.
   */
  async getSubmissions(filters: SubmissionFilters): Promise<SubmissionsResponse> {
    const params = new URLSearchParams();
    params.set('limit', String(filters.limit));
    params.set('offset', String(filters.offset));
    if (filters.category) params.set('category', filters.category);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    const response = await api.get(`/api/admin/submissions?${params.toString()}`);
    return response.data;
  },

  /** Fetch a single submission by its UUID. */
  async getSubmission(id: string): Promise<{ submission: Submission }> {
    const response = await api.get(`/api/admin/submissions/${id}`);
    return response.data;
  },

  /**
   * Update a submission. Accepts any subset of Submission fields.
   * Used for both form field edits (school_name, selected_items, etc.)
   * and shipment tracking (shipments array append).
   */
  async updateSubmission(id: string, data: Partial<Submission>): Promise<{ success: boolean; submission: Submission }> {
    const response = await api.put(`/api/admin/submissions/${id}`, data);
    return response.data;
  },

  /** Permanently delete a submission by UUID. */
  async deleteSubmission(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/api/admin/submissions/${id}`);
    return response.data;
  },

  /** Fetch aggregate dashboard statistics (total count + per-category breakdown). */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/api/admin/dashboard/stats');
    return response.data;
  },

  /**
   * Download a CSV export of submissions matching the given filters.
   * Returns a Blob which is then converted to a downloadable file URL.
   */
  async exportCSV(filters?: { dateFrom?: string; dateTo?: string; category?: string }): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.set('dateTo', filters.dateTo);
    if (filters?.category) params.set('category', filters.category);
    const response = await api.get(`/api/admin/submissions/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
