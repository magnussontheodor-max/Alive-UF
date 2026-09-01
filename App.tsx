import { useFonts } from '@expo-google-fonts/fraunces/useFonts';
// Importing each weight from its own subpath (rather than the package
// root) keeps Metro from bundling all nine Fraunces weights + italics
// when we only ever use two of them.
import { Fraunces_500Medium } from '@expo-google-fonts/fraunces/500Medium';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useRegisterPushToken } from './src/hooks/useRegisterPushToken';
import { usePendingInvite } from './src/hooks/usePendingInvite';
import { supabase } from './src/lib/supabase';
import { HomeScreen } from './src/screens/HomeScreen';
import { HowItWorksScreen } from './src/screens/HowItWorksScreen';
import { NotConfiguredScreen } from './src/screens/NotConfiguredScreen';
import { OnboardingFlow } from './src/screens/OnboardingFlow';
import { PreAuthOnboarding } from './src/screens/PreAuthOnboarding';
import type { PreAuthDraft } from './src/screens/PreAuthOnboarding';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SignInScreen } from './src/screens/SignInScreen';
import { AuthProvider, useAuth } from './src/state/AuthContext';
import { CheckInProvider } from './src/state/CheckInContext';
import { ProfileProvider, useProfile } from './src/state/ProfileContext';
import { colors } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({ Fraunces_500Medium, Fraunces_600SemiBold });
  // Held above AuthProvider, not inside it: the invite link can arrive
  // before sign-in finishes (that's the whole point — the contact
  // isn't a user yet), so this has to survive the SignInScreen -> Root
  // transition rather than resetting with it.
  const { pendingInviteToken, clearPendingInvite } = usePendingInvite();

  if (!fontsLoaded) {
    // Plain, background-colored frame — faster than a spinner, and
    // never shows the wrong typeface flashing in.
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <AuthGate pendingInviteToken={pendingInviteToken} clearPendingInvite={clearPendingInvite} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

type AuthGateProps = {
  pendingInviteToken: string | null;
  clearPendingInvite: () => void;
};

/**
 * Everything below this line needs a real signed-in user — ProfileProvider
 * now reads/writes Supabase rows keyed to that person, not local-only
 * state, so it can't mount until a session exists. See AuthContext and
 * ARCHITECTURE.md.
 */
function AuthGate({ pendingInviteToken, clearPendingInvite }: AuthGateProps) {
  const { isConfigured, isLoading, session } = useAuth();
  // What PreAuthOnboarding collected (consent, persona), waiting to be
  // handed to OnboardingFlow once a session exists — see
  // PreAuthOnboarding's doc comment and "No navigation library" in
  // ARCHITECTURE.md for why sign-in now sits *after* the welcome/
  // consent/how-it-works/persona steps instead of gating them.
  const [preAuthDraft, setPreAuthDraft] = useState<PreAuthDraft | null>(null);
  // Flips once PreAuthOnboarding finishes normally (persona's
  // "Continue") *or* someone taps its "Already have an account? Sign
  // in" escape hatch — either way, the next screen is SignInScreen.
  const [readyForSignIn, setReadyForSignIn] = useState(false);

  // Root cause fix for the orphaned-draft bug: `onPreAuthDraftConsumed`
  // only clears `preAuthDraft` when OnboardingFlow actually ran and used
  // it. That leaves it (and `readyForSignIn`) stale whenever a session
  // ends *without* OnboardingFlow ever mounting — e.g. someone finishes
  // PreAuthOnboarding, signs into an already-onboarded account (so
  // OnboardingFlow never sees the draft), then deletes that account or
  // its session simply expires. Without this, the next sign-in would
  // skip straight back to SignInScreen (readyForSignIn still true) and,
  // worse, hand a brand-new account the previous person's draft —
  // silently recording *their* consent as if this new person had given
  // it. Resetting both any time `session` goes falsy — not just via the
  // narrower "OnboardingFlow consumed it" callback — guarantees a
  // signed-out session can never inherit a previous account's pre-auth
  // draft, no matter which of those paths ended it.
  useEffect(() => {
    if (session) return;
    setPreAuthDraft(null);
    setReadyForSignIn(false);
  }, [session]);

  // Claims a trusted-contact invite the moment both a session and a
  // pending token exist, regardless of which arrived first — accepting
  // one only ever links the two accounts (accept_invite in
  // supabase/migrations/0001_init.sql); it never touches this
  // person's own onboarding.
  useEffect(() => {
    if (!session || !pendingInviteToken) return;
    supabase.rpc('accept_invite', { token: pendingInviteToken }).then(({ error }) => {
      if (error) {
        console.warn('Failed to accept invite', error);
      } else {
        Alert.alert('Connected', "You'll be notified if they ever miss a check-in.");
      }
      clearPendingInvite();
    });
  }, [session, pendingInviteToken, clearPendingInvite]);

  if (!isConfigured) return <NotConfiguredScreen />;
  if (isLoading) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  if (!session) {
    if (!readyForSignIn) {
      return (
        <PreAuthOnboarding
          onDone={(draft) => {
            setPreAuthDraft(draft);
            setReadyForSignIn(true);
          }}
          onSkipToSignIn={() => setReadyForSignIn(true)}
        />
      );
    }
    return <SignInScreen />;
  }

  return (
    <ProfileProvider>
      <CheckInProvider>
        <Root preAuthDraft={preAuthDraft} onPreAuthDraftConsumed={() => setPreAuthDraft(null)} />
      </CheckInProvider>
    </ProfileProvider>
  );
}

type Screen = 'home' | 'settings' | 'howItWorks';

type RootProps = {
  /** Passed straight through to OnboardingFlow — see its own doc comment for what a missing/incomplete draft means there. */
  preAuthDraft: PreAuthDraft | null;
  /** Passed straight through to OnboardingFlow, called once it's actually used the draft — see there for why. */
  onPreAuthDraftConsumed: () => void;
};

/**
 * Picks onboarding vs. the real app, and within the real app which of
 * its three screens is showing — needs to live inside ProfileProvider
 * to read isOnboarded. Same "no navigation library yet" reasoning as
 * OnboardingFlow: a home/settings/how-it-works triangle is simple
 * enough for a bit of local state (see ARCHITECTURE.md).
 */
function Root({ preAuthDraft, onPreAuthDraftConsumed }: RootProps) {
  const { isOnboarded } = useProfile();
  const [screen, setScreen] = useState<Screen>('home');
  useRegisterPushToken();

  // If onboarding gets restarted (from Settings), land back on Home
  // once it's completed again, rather than reopening wherever the
  // restart happened to be triggered from.
  useEffect(() => {
    if (!isOnboarded) setScreen('home');
  }, [isOnboarded]);

  if (!isOnboarded) {
    return <OnboardingFlow preAuthDraft={preAuthDraft} onPreAuthDraftConsumed={onPreAuthDraftConsumed} />;
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        onBack={() => setScreen('home')}
        onOpenHowItWorks={() => setScreen('howItWorks')}
      />
    );
  }
  if (screen === 'howItWorks') {
    return <HowItWorksScreen onBack={() => setScreen('settings')} />;
  }
  return <HomeScreen onOpenSettings={() => setScreen('settings')} />;
}
