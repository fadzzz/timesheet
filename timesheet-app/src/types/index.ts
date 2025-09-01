export interface User {
  id: string;
  email: string;
  name: string;
  google_id: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: number;
  date: string;
  client: string;
  hours: number;
  description?: string;
  user_id: string;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface TimeEntryFormData {
  date: string;
  client: string;
  hours: number;
}