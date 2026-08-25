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
 */

type CheckInState = {
  /** Demo user. Will come from the authenticated profile later. */
  userName: string;
  /** Demo trusted contact. Will come from a real contacts feature later. */
  contactName: string;
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
      userName: 'Anna',
      contactName: 'Sara',
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
