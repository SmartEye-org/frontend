import { create } from 'zustand';
import { authService, LoginResponse } from '@/lib/api/auth-service';

interface AuthState {
  user: LoginResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
  setUser: (user: LoginResponse['user']) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    const token = authService.getToken();
    const user = authService.getUser();
    
    set({
      token,
      user,
      isAuthenticated: !!token,
      isLoading: false,
    });
  },

  login: async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  setUser: (user: LoginResponse['user']) => {
    set({ user });
  },
}));
