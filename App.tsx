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
  if (!session) return <SignInScreen />;

  return (
    <ProfileProvider>
      <CheckInProvider>
        <Root />
      </CheckInProvider>
    </ProfileProvider>
  );
}

type Screen = 'home' | 'settings' | 'howItWorks';

/**
 * Picks onboarding vs. the real app, and within the real app which of
 * its three screens is showing — needs to live inside ProfileProvider
 * to read isOnboarded. Same "no navigation library yet" reasoning as
 * OnboardingFlow: a home/settings/how-it-works triangle is simple
 * enough for a bit of local state (see ARCHITECTURE.md).
 */
function Root() {
  const { isOnboarded } = useProfile();
  const [screen, setScreen] = useState<Screen>('home');
  useRegisterPushToken();

  // If onboarding gets restarted (from Settings), land back on Home
  // once it's completed again, rather than reopening wherever the
  // restart happened to be triggered from.
  useEffect(() => {
    if (!isOnboarded) setScreen('home');
  }, [isOnboarded]);

  if (!isOnboarded) return <OnboardingFlow />;

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
