import { create } from 'zustand';
import { authService } from '../services/authService';

interface AuthStore {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem('aerobay_admin_token'),
  isAuthenticated: !!localStorage.getItem('aerobay_admin_token'),
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(username, password);
      if (data.success && data.token) {
        localStorage.setItem('aerobay_admin_token', data.token);
        set({ token: data.token, isAuthenticated: true, isLoading: false });
        return true;
      }
      set({ error: data.message || 'Login failed', isLoading: false });
      return false;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('aerobay_admin_token');
    set({ token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('aerobay_admin_token');
    const isAuth = !!token;
    if (get().isAuthenticated !== isAuth) {
      set({ token, isAuthenticated: isAuth });
    }
    return isAuth;
  },
}));
