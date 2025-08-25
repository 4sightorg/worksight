import {
  supabase,
  type Employee,
  type Task,
  type SurveyResponse,
  type UserSettings,
} from './supabase';
import { Employees } from '@/data/employees';
import { isOfflineMode } from '@/auth/offline';

// Employee API
export const employeeApi = {
  getAll: async (): Promise<Employee[]> => {
    if (isOfflineMode()) {
      return Object.entries(Employees).map(([id, emp]) => ({
        id,
        internal_id: emp.internal_id,
        email: emp.email,
        name: emp.name,
        role: emp.role,
        manager_id: emp.manager_id,
        date_joined: emp.date_joined.toISOString(),
        department: emp.department,
        created_at: emp.created_at.toISOString(),
        updated_at: emp.updated_at.toISOString(),
      }));
    }

    const { data, error } = await supabase.from('employees').select('*');

    if (error) throw error;
    return data || [];
  },

  getById: async (id: string): Promise<Employee | null> => {
    if (isOfflineMode()) {
      const emp = Employees[id];
      if (!emp) return null;
      return {
        id,
        internal_id: emp.internal_id,
        email: emp.email,
        name: emp.name,
        role: emp.role,
        manager_id: emp.manager_id,
        date_joined: emp.date_joined.toISOString(),
        department: emp.department,
        created_at: emp.created_at.toISOString(),
        updated_at: emp.updated_at.toISOString(),
      };
    }

    const { data, error } = await supabase.from('employees').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
  },

  getByEmail: async (email: string): Promise<Employee | null> => {
    if (isOfflineMode()) {
      const entry = Object.entries(Employees).find(([_, emp]) => emp.email === email);
      if (!entry) return null;
      const [id, emp] = entry;
      return {
        id,
        internal_id: emp.internal_id,
        email: emp.email,
        name: emp.name,
        role: emp.role,
        manager_id: emp.manager_id,
        date_joined: emp.date_joined.toISOString(),
        department: emp.department,
        created_at: emp.created_at.toISOString(),
        updated_at: emp.updated_at.toISOString(),
      };
    }

    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  },
};

// Tasks API
export const tasksApi = {
  getByUserId: async (userId: string): Promise<Task[]> => {
    if (isOfflineMode()) {
      // Return mock tasks for offline mode
      return [];
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
    if (isOfflineMode()) {
      throw new Error('Cannot create tasks in offline mode');
    }

    const { data, error } = await supabase.from('tasks').insert([task]).select().single();

    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    if (isOfflineMode()) {
      throw new Error('Cannot update tasks in offline mode');
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    if (isOfflineMode()) {
      throw new Error('Cannot delete tasks in offline mode');
    }

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) throw error;
  },
};

// Survey API
export const surveyApi = {
  submit: async (userId: string, responses: any, burnoutScore: number): Promise<SurveyResponse> => {
    if (isOfflineMode()) {
      // Store in localStorage for offline mode
      const offlineResponse: SurveyResponse = {
        id: `offline-${Date.now()}`,
        user_id: userId,
        responses,
        burnout_score: burnoutScore,
        created_at: new Date().toISOString(),
      };

      const existingResponses = JSON.parse(localStorage.getItem('offline_surveys') || '[]');
      existingResponses.push(offlineResponse);
      localStorage.setItem('offline_surveys', JSON.stringify(existingResponses));

      return offlineResponse;
    }

    const { data, error } = await supabase
      .from('survey_responses')
      .insert([
        {
          user_id: userId,
          responses,
          burnout_score: burnoutScore,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getByUserId: async (userId: string): Promise<SurveyResponse[]> => {
    if (isOfflineMode()) {
      const offlineResponses = JSON.parse(localStorage.getItem('offline_surveys') || '[]');
      return offlineResponses.filter((response: SurveyResponse) => response.user_id === userId);
    }

    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

// Settings API
export const settingsApi = {
  get: async (userId: string): Promise<UserSettings | null> => {
    if (isOfflineMode()) {
      const offlineSettings = localStorage.getItem(`settings_${userId}`);
      return offlineSettings ? JSON.parse(offlineSettings) : null;
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  upsert: async (userId: string, settings: Partial<UserSettings>): Promise<UserSettings> => {
    if (isOfflineMode()) {
      const offlineSettings: UserSettings = {
        id: `offline-${userId}`,
        user_id: userId,
        notifications_enabled: true,
        theme: 'system',
        survey_frequency: 'weekly',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...settings,
      };

      localStorage.setItem(`settings_${userId}`, JSON.stringify(offlineSettings));
      return offlineSettings;
    }

    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
