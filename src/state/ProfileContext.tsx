import React, { createContext, useContext, useMemo, useState } from 'react';

import {
  CheckInWindow,
  DEFAULT_CHECK_IN_WINDOW,
  DEFAULT_GRACE_MINUTES,
  SubjectMode,
  TrustedContact,
} from '../types/profile';

/**
 * DEMO / LOCAL STATE ONLY — see CheckInContext.tsx for the full
 * explanation. This holds what onboarding collects: who ALIVE is for,
 * their name, their trusted contact(s), a check-in deadline, and a
 * grace period. Nothing here is sent anywhere; it lives only in memory
 * for this run of the app.
 *
 * Splitting this from CheckInContext mirrors how the real backend will
 * likely be shaped later: a profile/contact record versus a day-to-day
 * check-in record.
 */

type ProfileState = {
  isOnboarded: boolean;
  /** "self" (default) or "other" — a caregiver setting ALIVE up for someone else. Only changes onboarding copy today; see ARCHITECTURE.md. */
  subjectMode: SubjectMode;
  userName: string;
  /** Up to MAX_TRUSTED_CONTACTS entries, each with a name and phone number. */
  contacts: TrustedContact[];
  checkInWindow: CheckInWindow;
  /** Minutes after the deadline before trusted contacts are told — one of GRACE_OPTIONS. */
  graceMinutes: number;
  setSubjectMode: (mode: SubjectMode) => void;
  setUserName: (name: string) => void;
  setContacts: (contacts: TrustedContact[]) => void;
  setCheckInWindow: (window: CheckInWindow) => void;
  setGraceMinutes: (minutes: number) => void;
  completeOnboarding: () => void;
  /** Testing only — clears everything and returns to onboarding. */
  restartOnboarding: () => void;
};

const ProfileContext = createContext<ProfileState | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [subjectMode, setSubjectMode] = useState<SubjectMode>('self');
  const [userName, setUserName] = useState('');
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [checkInWindow, setCheckInWindow] = useState<CheckInWindow>(DEFAULT_CHECK_IN_WINDOW);
  const [graceMinutes, setGraceMinutes] = useState<number>(DEFAULT_GRACE_MINUTES);

  const value = useMemo<ProfileState>(
    () => ({
      isOnboarded,
      subjectMode,
      userName,
      contacts,
      checkInWindow,
      graceMinutes,
      setSubjectMode,
      setUserName,
      setContacts,
      setCheckInWindow,
      setGraceMinutes,
      completeOnboarding: () => setIsOnboarded(true),
      restartOnboarding: () => {
        setIsOnboarded(false);
        setSubjectMode('self');
        setUserName('');
        setContacts([]);
        setCheckInWindow(DEFAULT_CHECK_IN_WINDOW);
        setGraceMinutes(DEFAULT_GRACE_MINUTES);
      },
    }),
    [isOnboarded, subjectMode, userName, contacts, checkInWindow, graceMinutes]
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
