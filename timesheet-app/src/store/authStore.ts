import { create } from 'zustand';
import type { AuthState, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const IS_STATIC_MODE = !API_URL || API_URL.includes('your-backend-url') || (!API_URL.includes('localhost') && !API_URL.includes('onrender.com') && !API_URL.includes('railway.app'));

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: () => {
    if (IS_STATIC_MODE) {
      // In static mode, create a demo user
      const demoUser: User = {
        id: 'demo-user',
        email: 'demo@example.com',
        name: 'Demo User',
        google_id: 'demo-google-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      set({ user: demoUser, isAuthenticated: true });
    } else {
      // Redirect to backend OAuth endpoint
      window.location.href = `${API_URL}/auth/google`;
    }
  },

  logout: async () => {
    // Clear stored user data
    localStorage.removeItem('timesheet_user');
    localStorage.removeItem('demo_user');
    set({ user: null, isAuthenticated: false });
    
    // Redirect to login
    window.location.href = '/';
  },

  checkAuth: async () => {
    if (IS_STATIC_MODE) {
      // In static mode, check localStorage
      const storedUser = localStorage.getItem('demo_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const user: User = await response.json();
          set({ user, isAuthenticated: true, isLoading: false });
        } else {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    }
  },
}));