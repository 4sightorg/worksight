import { createClient, SupabaseClientOptions } from '@supabase/supabase-js';
import type { Database } from './types';

// Environment variables with validation
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing required Supabase environment variables');
}

/**
 * Creates a Supabase client for client-side operations
 * Use this in components, client-side utilities, and browser code
 */
export function createBrowserClient(options?: SupabaseClientOptions<'public'>) {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    ...options,
  });
}

/**
 * Creates a Supabase client with service role key for admin operations
 * Use this only in secure server environments for administrative tasks
 */
export function createServiceRoleClient(options?: SupabaseClientOptions<'service_role'>) {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service role client');
  }

  // Type assertion needed for service role client with custom schema
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    ...options,
  } as unknown as SupabaseClientOptions<'public'>);
}

// Legacy exports for backward compatibility (deprecated)
/**
 * @deprecated Use createBrowserClient() instead
 */
export const getClient = createBrowserClient;
