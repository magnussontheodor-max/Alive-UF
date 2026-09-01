import type { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { isPreviewMode } from '../lib/previewMode';

// A synthetic, always-signed-in session for preview builds — see
// isPreviewMode's doc comment. user.id is deliberately '' rather than
// a fake uuid: ProfileContext/CheckInContext both branch on `!userId`
// to skip their Supabase calls, and '' is falsy, so every one of those
// existing guards skips the network for free with no separate preview
// branch needed in either file beyond their own initial data load.
const PREVIEW_SESSION = {
  access_token: 'preview',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'preview',
  user: { id: '', email: 'preview@example.com' },
} as unknown as Session;

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
  const [session, setSession] = useState<Session | null>(isPreviewMode ? PREVIEW_SESSION : null);
  const [isLoading, setIsLoading] = useState(!isPreviewMode);

  useEffect(() => {
    // Session above is already final for a preview build — never
    // touches Supabase, on purpose (see isPreviewMode).
    if (isPreviewMode) return;
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
        if (isPreviewMode) return;
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true },
        });
        if (error) throw error;
      },
      verifyCode: async (email: string, code: string) => {
        if (isPreviewMode) return;
        const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
        if (error) throw error;
      },
      signOut: async () => {
        if (isPreviewMode) return;
        await supabase.auth.signOut();
      },
      deleteAccount: async () => {
        // Guarded explicitly, not left to fall through to userId
        // being falsy like the other contexts' calls do: this one
        // doesn't check userId at all before calling Supabase, so a
        // tap on "Delete my account" in a preview build must never
        // reach the real backend.
        if (isPreviewMode) return;
        const { error } = await supabase.rpc('delete_own_account');
        if (error) throw error;
        // The row this session's access token pointed at is already
        // gone server-side; sign out locally to clear it here too
        // rather than leaving a dead session sitting in AsyncStorage.
        // The account is already deleted at this point, so a failure
        // here (network blip, etc.) must never surface as a deletion
        // failure to the caller — it's local cleanup on top of a
        // deletion that already succeeded, nothing more.
        try {
          await supabase.auth.signOut();
        } catch {
          // Swallowed on purpose — see comment above.
        }
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
