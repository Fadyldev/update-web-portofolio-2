import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Validate that environment variables are non-empty and not placeholders
const isValidUrl = (url?: string): boolean => {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed.includes('MY_') || trimmed.includes('YOUR_') || trimmed.includes('example.supabase.co')) {
    return false;
  }
  return trimmed.startsWith('https://') || trimmed.startsWith('http://');
};

const isValidKey = (key?: string): boolean => {
  if (!key) return false;
  const trimmed = key.trim();
  if (trimmed === '' || trimmed.includes('MY_') || trimmed.includes('YOUR_') || trimmed.length < 20) {
    return false;
  }
  return true;
};

export const isSupabaseConfigured = isValidUrl(rawUrl) && isValidKey(rawAnonKey);

export const supabaseConfigStatus = {
  urlConfigured: isValidUrl(rawUrl),
  keyConfigured: isValidKey(rawAnonKey),
  isFullyConfigured: isSupabaseConfigured,
  urlDomain: rawUrl ? (rawUrl.replace(/^https?:\/\//, '').split('/')[0] || 'Tercatat') : 'Belum Terisi',
};

export const supabase: SupabaseClient | null = isSupabaseConfigured && rawUrl && rawAnonKey
  ? createClient(rawUrl.trim(), rawAnonKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export type { User, Session };
