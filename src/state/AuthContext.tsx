import type { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { isSupabaseConfigured, supabase } from '../lib/supabase';

/**
 * Email one-time-code sign-in, not a magic link. Both are the same
 * Supabase feature under the hood (`signInWithOtp`); the difference is
 * just what the emailed message contains, decided by the project's
 * email template. A clickable link means handling a deep link back
 * into the app to hand off the session, which has real documented
 * flakiness on iOS in Expo apps (the redirect URL sometimes never
 * reaches `Linking`). A 6-digit code the person types back in sidesteps
 * that entirely: no redirect, no platform quirks, same two-tap effort.
 * This DOES require the Supabase project's "Magic Link" email template
 * to render `{{ .Token }}` instead of `{{ .ConfirmationURL }}` — see
 * ARCHITECTURE.md for the exact dashboard steps.
 */
type AuthState = {
  /** False until real Supabase keys are in .env — see src/lib/supabase.ts. */
  isConfigured: boolean;
  /** True only while checking for an existing session on launch. */
  isLoading: boolean;
  session: Session | null;
  sendCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  /**
   * GDPR Art. 17, right to erasure — permanently deletes this
   * account's row in auth.users via delete_own_account()
   * (supabase/migrations/0002_gdpr.sql), which cascades to every
   * table that references it (profile, trusted contacts, check-ins,
   * push tokens). Irreversible; signs out locally afterward since the
   * session it was holding no longer refers to anything.
   */
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      isConfigured: isSupabaseConfigured,
      isLoading,
      session,
      sendCode: async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true },
        });
        if (error) throw error;
      },
      verifyCode: async (email: string, code: string) => {
        const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
        if (error) throw error;
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
      deleteAccount: async () => {
        const { error } = await supabase.rpc('delete_own_account');
        if (error) throw error;
        // The row this session's access token pointed at is already
        // gone server-side; sign out locally to clear it here too
        // rather than leaving a dead session sitting in AsyncStorage.
        await supabase.auth.signOut();
      },
    }),
    [isLoading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
