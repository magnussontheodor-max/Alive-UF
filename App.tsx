import { useFonts } from '@expo-google-fonts/fraunces/useFonts';
// Importing each weight from its own subpath (rather than the package
// root) keeps Metro from bundling all nine Fraunces weights + italics
// when we only ever use two of them.
import { Fraunces_500Medium } from '@expo-google-fonts/fraunces/500Medium';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from './src/screens/HomeScreen';
import { OnboardingFlow } from './src/screens/OnboardingFlow';
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

/** Picks onboarding vs. the real app — needs to live inside ProfileProvider to read isOnboarded. */
function Root() {
  const { isOnboarded } = useProfile();
  return isOnboarded ? <HomeScreen /> : <OnboardingFlow />;
}
