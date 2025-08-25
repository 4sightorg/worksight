// User roles enum for type safety
export enum UserRole {
  EMPLOYEE = 'employee',
  TEAM_LEAD = 'team_lead',
  MANAGER = 'manager',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

// User interface for type safety
export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  role?: UserRole | string;
  department?: string;
  team?: string;
  user_metadata?: {
    name?: string;
    username?: string;
    role?: UserRole | string;
    department?: string;
    team?: string;
  };
  access_token?: string;
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
