export interface User {
  id: string;
  email: string;
  name: string;
  google_id: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

declare global {
  namespace Express {
    interface User extends SessionUser {}
  }
}