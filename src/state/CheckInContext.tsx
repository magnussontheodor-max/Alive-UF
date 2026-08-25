import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * DEMO / LOCAL STATE ONLY.
 *
 * This context simulates what check-ins will look like once ALIVE has a
 * real backend (Supabase), real trusted contacts, and real notifications
 * (Twilio/Expo push). None of that exists yet — nothing here leaves the
 * device, and no message is ever actually sent to anyone.
 *
 * When we build the real thing, this Provider gets replaced by one that
 * reads/writes Supabase. Screens that consume `useCheckIn()` shouldn't
 * need to change at all — that's the point of keeping this behind a
 * single hook.
 *
 * Who the user is and who their trusted contact is lives in
 * ProfileContext, not here — this context is only about *today's*
 * check-in.
 */

type CheckInState = {
  /** When the user last checked in today, or null if they haven't yet. */
  lastCheckInAt: Date | null;
  /** Record a check-in right now (demo only — nobody is notified). */
  checkIn: () => void;
  /** Clear today's check-in, for testing the flow again. */
  reset: () => void;
};

const CheckInContext = createContext<CheckInState | undefined>(undefined);

export function CheckInProvider({ children }: { children: React.ReactNode }) {
  const [lastCheckInAt, setLastCheckInAt] = useState<Date | null>(null);

  const value = useMemo<CheckInState>(
    () => ({
      lastCheckInAt,
      checkIn: () => setLastCheckInAt(new Date()),
      reset: () => setLastCheckInAt(null),
    }),
    [lastCheckInAt]
  );

  return <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>;
}

export function useCheckIn(): CheckInState {
  const ctx = useContext(CheckInContext);
  if (!ctx) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return ctx;
}
