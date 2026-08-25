import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from './src/screens/HomeScreen';
import { CheckInProvider } from './src/state/CheckInContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <CheckInProvider>
        <StatusBar style="dark" />
        <HomeScreen />
      </CheckInProvider>
    </SafeAreaProvider>
  );
}
