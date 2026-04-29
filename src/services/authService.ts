import api from './api';

export const authService = {
  async login(username: string, password: string) {
    const response = await api.post('/api/auth/login', { username, password });
    return response.data;
  },
};
