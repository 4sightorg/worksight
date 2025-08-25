import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types to match your schema
export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          internal_id: string;
          email: string;
          name: string;
          role: string;
          manager_id: string;
          date_joined: string;
          department: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          internal_id: string;
          email: string;
          name: string;
          role: string;
          manager_id?: string;
          date_joined: string;
          department: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          internal_id?: string;
          email?: string;
          name?: string;
          role?: string;
          manager_id?: string;
          date_joined?: string;
          department?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: 'pending' | 'in-progress' | 'completed';
          priority: 'low' | 'medium' | 'high';
          due_date: string;
          story_points: number;
          assigned_to: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          status?: 'pending' | 'in-progress' | 'completed';
          priority?: 'low' | 'medium' | 'high';
          due_date: string;
          story_points?: number;
          assigned_to: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: 'pending' | 'in-progress' | 'completed';
          priority?: 'low' | 'medium' | 'high';
          due_date?: string;
          story_points?: number;
          assigned_to?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      survey_responses: {
        Row: {
          id: string;
          user_id: string;
          responses: any;
          burnout_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          responses: any;
          burnout_score: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          responses?: any;
          burnout_score?: number;
          created_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          notifications_enabled: boolean;
          theme: 'light' | 'dark' | 'system';
          survey_frequency: 'daily' | 'weekly' | 'monthly';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notifications_enabled?: boolean;
          theme?: 'light' | 'dark' | 'system';
          survey_frequency?: 'daily' | 'weekly' | 'monthly';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          notifications_enabled?: boolean;
          theme?: 'light' | 'dark' | 'system';
          survey_frequency?: 'daily' | 'weekly' | 'monthly';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export type Employee = Database['public']['Tables']['employees']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type SurveyResponse = Database['public']['Tables']['survey_responses']['Row'];
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];
