import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

/**
 * The one Supabase client for the app. Reads from `EXPO_PUBLIC_*` env
 * vars (Expo bundles anything prefixed `EXPO_PUBLIC_` straight into the
 * client, which is exactly right here: the project URL and anon key
 * are meant to be public — every mobile client embeds them, and
 * access control is enforced server-side by Postgres Row Level
 * Security, not by keeping this key secret. See .env.example.
 *
 * `isSupabaseConfigured` lets the rest of the app fail obviously
 * (a clear "not configured" screen) instead of throwing deep inside a
 * network call when someone runs the project before setting up a real
 * project — see AuthContext.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      // The app never renders anything server-side, so it always
      // completes the magic-link session exchange itself (see
      // AuthContext's deep-link handler) rather than expecting
      // Supabase's browser-only URL-detection to run.
      detectSessionInUrl: false,
    },
  }
);
