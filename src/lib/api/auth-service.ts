import { BaseApiService } from './base-service';
import type { ApiResponse } from '@/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    building?: {
      id: string;
      name: string;
      code: string;
    };
  };
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  building_id?: string;
  created_at: string;
  updated_at: string;
}

class AuthService extends BaseApiService {
  constructor() {
    super('/auth');
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.post<ApiResponse<LoginResponse>>(
      '/login',
      credentials
    );
    
    if (!response.data) {
      throw new Error('Login failed');
    }

    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await this.post('/logout');
    } finally {
      // Clear localStorage even if API call fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await this.get<ApiResponse<ProfileResponse>>('/profile');
    
    if (!response.data) {
      throw new Error('Failed to get profile');
    }

    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  /**
   * Get stored user
   */
  getUser(): LoginResponse['user'] | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();
