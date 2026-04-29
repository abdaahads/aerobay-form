import api from './api';
import type { SubmissionFilters, SubmissionsResponse, DashboardStats, Submission } from '../types';

export const adminService = {
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

  async getSubmission(id: string): Promise<{ submission: Submission }> {
    const response = await api.get(`/api/admin/submissions/${id}`);
    return response.data;
  },

  async updateSubmission(id: string, data: Partial<Submission>): Promise<{ success: boolean; submission: Submission }> {
    const response = await api.put(`/api/admin/submissions/${id}`, data);
    return response.data;
  },

  async deleteSubmission(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/api/admin/submissions/${id}`);
    return response.data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/api/admin/dashboard/stats');
    return response.data;
  },

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
