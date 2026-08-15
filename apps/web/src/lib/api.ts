import { isOfflineMode } from '@/auth/offline';
import { Employees } from '@/data/employees';
import {
    supabase,
    type Employee,
    type UserSettings,
} from './supabase';

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
