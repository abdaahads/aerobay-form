import api from './api';
import type { FormSubmissionPayload, FormSubmissionResponse } from '../types';

export const formService = {
  async submitForm(data: FormSubmissionPayload): Promise<FormSubmissionResponse> {
    const response = await api.post<FormSubmissionResponse>('/api/forms/submit', data);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/api/forms/categories');
    return response.data;
  },
};
