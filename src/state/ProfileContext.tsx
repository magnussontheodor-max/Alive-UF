import React, { createContext, useContext, useMemo, useState } from 'react';

import type { CheckInWindow } from '../types/profile';

/**
 * DEMO / LOCAL STATE ONLY — see CheckInContext.tsx for the full
 * explanation. This holds what onboarding collects: the user's name,
 * their trusted contact's name, and a check-in window. Nothing here is
 * sent anywhere; it lives only in memory for this run of the app.
 *
 * Splitting this from CheckInContext mirrors how the real backend will
 * likely be shaped later: a profile/contact record versus a day-to-day
 * check-in record.
 */

type ProfileState = {
  isOnboarded: boolean;
  userName: string;
  contactName: string;
  checkInWindow: CheckInWindow;
  setUserName: (name: string) => void;
  setContactName: (name: string) => void;
  setCheckInWindow: (window: CheckInWindow) => void;
  completeOnboarding: () => void;
  /** Testing only — clears everything and returns to onboarding. */
  restartOnboarding: () => void;
};

const ProfileContext = createContext<ProfileState | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userName, setUserName] = useState('');
  const [contactName, setContactName] = useState('');
  const [checkInWindow, setCheckInWindow] = useState<CheckInWindow>('morning');

  const value = useMemo<ProfileState>(
    () => ({
      isOnboarded,
      userName,
      contactName,
      checkInWindow,
      setUserName,
      setContactName,
      setCheckInWindow,
      completeOnboarding: () => setIsOnboarded(true),
      restartOnboarding: () => {
        setIsOnboarded(false);
        setUserName('');
        setContactName('');
        setCheckInWindow('morning');
      },
    }),
    [isOnboarded, userName, contactName, checkInWindow]
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
