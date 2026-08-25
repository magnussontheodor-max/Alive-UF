import React, { createContext, useContext, useMemo, useState } from 'react';

import type { CheckInWindow, TrustedContact } from '../types/profile';

/**
 * DEMO / LOCAL STATE ONLY — see CheckInContext.tsx for the full
 * explanation. This holds what onboarding collects: the user's name,
 * their trusted contact(s), and a check-in window. Nothing here is
 * sent anywhere; it lives only in memory for this run of the app.
 *
 * Splitting this from CheckInContext mirrors how the real backend will
 * likely be shaped later: a profile/contact record versus a day-to-day
 * check-in record.
 */

type ProfileState = {
  isOnboarded: boolean;
  userName: string;
  /** Up to MAX_TRUSTED_CONTACTS entries, each with a name and phone number. */
  contacts: TrustedContact[];
  checkInWindow: CheckInWindow;
  setUserName: (name: string) => void;
  setContacts: (contacts: TrustedContact[]) => void;
  setCheckInWindow: (window: CheckInWindow) => void;
  completeOnboarding: () => void;
  /** Testing only — clears everything and returns to onboarding. */
  restartOnboarding: () => void;
};

const ProfileContext = createContext<ProfileState | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userName, setUserName] = useState('');
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [checkInWindow, setCheckInWindow] = useState<CheckInWindow>('morning');

  const value = useMemo<ProfileState>(
    () => ({
      isOnboarded,
      userName,
      contacts,
      checkInWindow,
      setUserName,
      setContacts,
      setCheckInWindow,
      completeOnboarding: () => setIsOnboarded(true),
      restartOnboarding: () => {
        setIsOnboarded(false);
        setUserName('');
        setContacts([]);
        setCheckInWindow('morning');
      },
    }),
    [isOnboarded, userName, contacts, checkInWindow]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileState {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return ctx;
}
