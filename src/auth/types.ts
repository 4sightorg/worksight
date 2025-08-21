// User interface for type safety
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  saveLogin: boolean;
}

export interface AuthResponse {
  user: User | null;
  error: { message: string } | null;
  accessToken: string | null;
}

export interface SessionData {
  user: User;
  accessToken: string;
  timestamp: number;
  saveLogin: boolean;
}
