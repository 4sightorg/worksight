import { createClient } from '@supabase/supabase-js';

// Define the database schema types here
// You can generate these automatically with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add more table types as needed
      surveys: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Export typed Supabase client
export type SupabaseClient = ReturnType<typeof createClient<Database>>;

// Auth user type with extended metadata
export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  updated_at?: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    username?: string;
    signup_completed?: boolean;
    [key: string]: unknown;
  };
  app_metadata: {
    provider?: string;
    providers?: string[];
    [key: string]: unknown;
  };
}

// Session type
export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: AuthUser;
}

// Common response types
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  count: number | null;
  error: Error | null;
}

// Hook return types
export interface UseAuthReturn {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<ApiResponse<AuthSession>>;
  signUp: (email: string, password: string) => Promise<ApiResponse<AuthUser>>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

// Custom error types
export class SupabaseError extends Error {
  code: string;
  details: string;
  hint: string;
  message: string;

  constructor(error: Record<string, unknown>) {
    super(error.message as string);
    this.name = 'SupabaseError';
    this.code = (error.code as string) || 'UNKNOWN_ERROR';
    this.details = (error.details as string) || '';
    this.hint = (error.hint as string) || '';
    this.message = (error.message as string) || 'An unknown error occurred';
  }
}

// Utility types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Profile type shortcuts
export type Profile = Tables<'profiles'>;
export type ProfileInsert = Inserts<'profiles'>;
export type ProfileUpdate = Updates<'profiles'>;

// Survey type shortcuts
export type Survey = Tables<'surveys'>;
export type SurveyInsert = Inserts<'surveys'>;
export type SurveyUpdate = Updates<'surveys'>;
