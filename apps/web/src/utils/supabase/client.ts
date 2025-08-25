import { createBrowserClient } from '@supabase/ssr';

// Fallback values for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key';

export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey);
