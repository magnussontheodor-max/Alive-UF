import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';

import { supabase } from '../lib/supabase';
import { PRIVACY_POLICY_VERSION } from '../legal/content';
import { colors } from '../theme';
import {
  CheckInWindow,
  DEFAULT_CHECK_IN_WINDOW,
  DEFAULT_GRACE_MINUTES,
  SubjectMode,
  TrustedContact,
} from '../types/profile';
import { useAuth } from './AuthContext';

/**
 * Real, per-user state, backed by Supabase (`profiles` + `trusted_contacts`)
 * — see ARCHITECTURE.md. `useProfile()`'s shape is unchanged from the
 * local-only version this replaced: every screen that reads or writes
 * it keeps working exactly as it did before. Only what's behind the
 * hook changed, from a useState that reset on every reload to rows
 * that persist and that a linked trusted contact can also read.
 */

type ProfileState = {
  isOnboarded: boolean;
  /** True once this account has recorded agreeing to the current Privacy Policy/Terms — see ConsentStep. */
  privacyAccepted: boolean;
  subjectMode: SubjectMode;
  userName: string;
  contacts: TrustedContact[];
  checkInWindow: CheckInWindow;
  graceMinutes: number;
  setSubjectMode: (mode: SubjectMode) => void;
  setUserName: (name: string) => void;
  setContacts: (contacts: TrustedContact[]) => void;
  setCheckInWindow: (window: CheckInWindow) => void;
  setGraceMinutes: (minutes: number) => void;
  /** Records consent to the current policy version — called once, from ConsentStep via OnboardingFlow.handleFinish. */
  acceptPrivacyPolicy: () => void;
  completeOnboarding: () => void;
  /** Testing only — clears everything and returns to onboarding. */
  restartOnboarding: () => void;
};

const ProfileContext = createContext<ProfileState | undefined>(undefined);

type ProfileRow = {
  subject_mode: SubjectMode;
  user_name: string;
  check_in_hour: number;
  check_in_minute: number;
  grace_minutes: number;
  onboarding_completed_at: string | null;
  privacy_accepted_at: string | null;
};

type ContactRow = {
  id: string;
  name: string;
  phone: string;
  invite_token: string;
  status: 'pending' | 'linked';
};

function contactFromRow(row: ContactRow): TrustedContact {
  return { id: row.id, name: row.name, phone: row.phone, inviteToken: row.invite_token, status: row.status };
}

async function refetchContacts(ownerId: string): Promise<TrustedContact[] | null> {
  const { data, error } = await supabase
    .from('trusted_contacts')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at');
  if (error || !data) {
    console.warn('Failed to load trusted contacts', error);
    return null;
  }
  return (data as ContactRow[]).map(contactFromRow);
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user.id;

  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [subjectMode, setSubjectModeState] = useState<SubjectMode>('self');
  const [userName, setUserNameState] = useState('');
  const [contacts, setContactsState] = useState<TrustedContact[]>([]);
  const [checkInWindow, setCheckInWindowState] = useState<CheckInWindow>(DEFAULT_CHECK_IN_WINDOW);
  const [graceMinutes, setGraceMinutesState] = useState<number>(DEFAULT_GRACE_MINUTES);

  // Text fields (name, contact name/phone) write on every keystroke
  // otherwise — debounced so typing a name doesn't fire a network
  // request per character. Selection-driven setters below (tap the
  // wheel, tap a card) don't need this; they already fire once per
  // choice, not once per frame.
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const debounced = useCallback((key: string, fn: () => void, delayMs = 500) => {
    if (debounceTimers.current[key]) clearTimeout(debounceTimers.current[key]);
    debounceTimers.current[key] = setTimeout(fn, delayMs);
  }, []);
  useEffect(
    () => () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    },
    []
  );

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      const [profileResult, contactsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        refetchContacts(userId),
      ]);

      if (cancelled) return;

      if (profileResult.error) {
        console.warn('Failed to load profile', profileResult.error);
      } else if (profileResult.data) {
        const row = profileResult.data as ProfileRow;
        setSubjectModeState(row.subject_mode);
        setUserNameState(row.user_name);
        setCheckInWindowState({ hour: row.check_in_hour, minute: row.check_in_minute });
        setGraceMinutesState(row.grace_minutes);
        setIsOnboarded(row.onboarding_completed_at !== null);
        setPrivacyAccepted(row.privacy_accepted_at !== null);
      }
      if (contactsResult) setContactsState(contactsResult);

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const setSubjectMode = useCallback(
    (mode: SubjectMode) => {
      setSubjectModeState(mode);
      if (!userId) return;
      supabase
        .from('profiles')
        .update({ subject_mode: mode })
        .eq('id', userId)
        .then(({ error }) => {
          if (error) console.warn('Failed to save who ALIVE is for', error);
        });
    },
    [userId]
  );

  const setUserName = useCallback(
    (name: string) => {
      setUserNameState(name);
      if (!userId) return;
      debounced('userName', () => {
        supabase
          .from('profiles')
          .update({ user_name: name })
          .eq('id', userId)
          .then(({ error }) => {
            if (error) console.warn('Failed to save name', error);
          });
      });
    },
    [userId, debounced]
  );

  const setContacts = useCallback(
    (next: TrustedContact[]) => {
      const previous = contacts;
      setContactsState(next);
      if (!userId) return;

      debounced('contacts', () => {
        (async () => {
          const maxLen = Math.max(previous.length, next.length);
          const writes: Promise<unknown>[] = [];

          for (let i = 0; i < maxLen; i++) {
            const before = previous[i];
            const after = next[i];

            if (before && after) {
              if (before.name !== after.name || before.phone !== after.phone) {
                writes.push(
                  Promise.resolve(
                    supabase.from('trusted_contacts').update({ name: after.name, phone: after.phone }).eq('id', before.id)
                  )
                );
              }
            } else if (!before && after) {
              writes.push(
                Promise.resolve(
                  supabase.from('trusted_contacts').insert({ owner_id: userId, name: after.name, phone: after.phone })
                )
              );
            } else if (before && !after) {
              writes.push(Promise.resolve(supabase.from('trusted_contacts').delete().eq('id', before.id)));
            }
          }

          await Promise.all(writes);
          // Re-fetch rather than guess at generated ids/invite tokens for
          // whatever just got inserted — this is the source of truth the
          // invite-link UI (ContactsStep) reads from.
          const fresh = await refetchContacts(userId);
          if (fresh) setContactsState(fresh);
        })();
      });
    },
    [contacts, userId, debounced]
  );

  const setCheckInWindow = useCallback(
    (window: CheckInWindow) => {
      setCheckInWindowState(window);
      if (!userId) return;
      supabase
        .from('profiles')
        .update({ check_in_hour: window.hour, check_in_minute: window.minute })
        .eq('id', userId)
        .then(({ error }) => {
          if (error) console.warn('Failed to save check-in time', error);
        });
    },
    [userId]
  );

  const setGraceMinutes = useCallback(
    (minutes: number) => {
      setGraceMinutesState(minutes);
      if (!userId) return;
      supabase
        .from('profiles')
        .update({ grace_minutes: minutes })
        .eq('id', userId)
        .then(({ error }) => {
          if (error) console.warn('Failed to save grace period', error);
        });
    },
    [userId]
  );

  const acceptPrivacyPolicy = useCallback(() => {
    setPrivacyAccepted(true);
    if (!userId) return;
    supabase
      .from('profiles')
      .update({
        privacy_accepted_at: new Date().toISOString(),
        privacy_policy_version: PRIVACY_POLICY_VERSION,
      })
      .eq('id', userId)
      .then(({ error }) => {
        if (error) console.warn('Failed to record privacy policy consent', error);
      });
  }, [userId]);

  const completeOnboarding = useCallback(() => {
    setIsOnboarded(true);
    if (!userId) return;
    supabase
      .from('profiles')
      .update({
        onboarding_completed_at: new Date().toISOString(),
        // Captured here, once, rather than on every launch: the escalation
        // check runs with no device of its own, so this is the only record
        // of what "10:00" means for this person. Falls back to the
        // column's UTC default if the runtime can't report a zone.
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      })
      .eq('id', userId)
      .then(({ error }) => {
        if (error) console.warn('Failed to complete onboarding', error);
      });
  }, [userId]);

  const restartOnboarding = useCallback(() => {
    setIsOnboarded(false);
    setSubjectModeState('self');
    setUserNameState('');
    setContactsState([]);
    setCheckInWindowState(DEFAULT_CHECK_IN_WINDOW);
    setGraceMinutesState(DEFAULT_GRACE_MINUTES);
    if (!userId) return;
    (async () => {
      await supabase
        .from('profiles')
        .update({
          onboarding_completed_at: null,
          subject_mode: 'self',
          user_name: '',
          check_in_hour: DEFAULT_CHECK_IN_WINDOW.hour,
          check_in_minute: DEFAULT_CHECK_IN_WINDOW.minute,
          grace_minutes: DEFAULT_GRACE_MINUTES,
        })
        .eq('id', userId);
      await supabase.from('trusted_contacts').delete().eq('owner_id', userId);
    })();
  }, [userId]);

  const value = useMemo<ProfileState>(
    () => ({
      isOnboarded,
      privacyAccepted,
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
      acceptPrivacyPolicy,
      completeOnboarding,
      restartOnboarding,
    }),
    [
      isOnboarded,
      privacyAccepted,
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
      acceptPrivacyPolicy,
      completeOnboarding,
      restartOnboarding,
    ]
  );

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileState {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return ctx;
}
