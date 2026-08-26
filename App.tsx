import { useFonts } from '@expo-google-fonts/fraunces/useFonts';
// Importing each weight from its own subpath (rather than the package
// root) keeps Metro from bundling all nine Fraunces weights + italics
// when we only ever use two of them.
import { Fraunces_500Medium } from '@expo-google-fonts/fraunces/500Medium';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from './src/screens/HomeScreen';
import { HowItWorksScreen } from './src/screens/HowItWorksScreen';
import { OnboardingFlow } from './src/screens/OnboardingFlow';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { CheckInProvider } from './src/state/CheckInContext';
import { ProfileProvider, useProfile } from './src/state/ProfileContext';
import { colors } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({ Fraunces_500Medium, Fraunces_600SemiBold });

  if (!fontsLoaded) {
    // Plain, background-colored frame — faster than a spinner, and
    // never shows the wrong typeface flashing in.
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <CheckInProvider>
          <StatusBar style="dark" />
          <Root />
        </CheckInProvider>
      </ProfileProvider>
    </SafeAreaProvider>
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
