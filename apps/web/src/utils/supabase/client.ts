import { createClient, SupabaseClientOptions } from '@supabase/supabase-js';
import type { Database } from './types';

const PLACEHOLDER_SUPABASE_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_SUPABASE_KEY = 'placeholder-anon-key';

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_SUPABASE_URL;
}

function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_SUPABASE_KEY;
}

function assertSupabaseEnv(): void {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isBuild =
    process.env.NEXT_PHASE === 'phase-production-build' || process.env.npm_lifecycle_event === 'build';

  if ((!url || !key) && !isBuild) {
    // Only enforce when actually used at runtime outside of build
    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
      throw new Error('Missing required Supabase environment variables');
    }
  }
}

/**
 * Creates a Supabase client for client-side operations
 * Use this in components, client-side utilities, and browser code
 */
export function createBrowserClient(options?: SupabaseClientOptions<'public'>) {
  assertSupabaseEnv();
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
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
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service role client');
  }

  // Type assertion needed for service role client with custom schema
  return createClient<Database>(getSupabaseUrl(), serviceRoleKey, {
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
