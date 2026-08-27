import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { supabase } from '../lib/supabase';
import { colors } from '../theme';
import { useAuth } from './AuthContext';

/**
 * Real, per-user check-in state, backed by Supabase's `check_ins`
 * table — one row per person per calendar day, written once and never
 * mutated (see supabase/migrations/0001_init.sql). `useCheckIn()`'s
 * shape is unchanged from the local-only version this replaced, so
 * HomeScreen didn't need to change at all.
 *
 * Who the user is and who their trusted contact is lives in
 * ProfileContext, not here — this context is only about *today's*
 * check-in.
 */

type CheckInState = {
  /** When the user last checked in today, or null if they haven't yet. */
  lastCheckInAt: Date | null;
  /** Record a check-in right now. */
  checkIn: () => void;
  /** Clear today's check-in, for testing the flow again. */
  reset: () => void;
};

const CheckInContext = createContext<CheckInState | undefined>(undefined);

/**
 * The device's local calendar date as YYYY-MM-DD. Matches how the
 * escalation Edge Function derives "today" server-side once a profile
 * has a timezone (set at onboarding) — both read the same wall-clock
 * date, just computed on different clocks.
 */
function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function CheckInProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id;

  const [loading, setLoading] = useState(true);
  const [lastCheckInAt, setLastCheckInAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    supabase
      .from('check_ins')
      .select('checked_in_at')
      .eq('user_id', userId)
      .eq('day', todayKey())
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.warn("Failed to load today's check-in", error);
        setLastCheckInAt(data ? new Date(data.checked_in_at) : null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const checkIn = useCallback(() => {
    const now = new Date();
    // Recorded immediately, so the timestamp reflects the actual tap
    // rather than whenever the network write happens to land.
    setLastCheckInAt(now);
    if (!userId) return;
    supabase
      .from('check_ins')
      .insert({ user_id: userId, day: todayKey(), checked_in_at: now.toISOString() })
      .then(({ error }) => {
        if (error) console.warn('Failed to record check-in', error);
      });
  }, [userId]);

  const reset = useCallback(() => {
    setLastCheckInAt(null);
    if (!userId) return;
    supabase
      .from('check_ins')
      .delete()
      .eq('user_id', userId)
      .eq('day', todayKey())
      .then(({ error }) => {
        if (error) console.warn('Failed to reset check-in', error);
      });
  }, [userId]);

  const value = useMemo<CheckInState>(
    () => ({ lastCheckInAt, checkIn, reset }),
    [lastCheckInAt, checkIn, reset]
  );

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>;
}

export function useCheckIn(): CheckInState {
  const ctx = useContext(CheckInContext);
  if (!ctx) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return ctx;
}
