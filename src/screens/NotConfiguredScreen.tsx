import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Wordmark } from '../components/Wordmark';
import { colors, spacing, typography } from '../theme';

/**
 * Shown instead of crashing when the app runs without real Supabase
 * keys in .env — see .env.example and src/lib/supabase.ts. A blank
 * network-error screen would look like a bug; this says plainly what's
 * missing and where to fix it.
 */
export function NotConfiguredScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Wordmark size="large" />
        <Text style={styles.title}>Backend not set up yet</Text>
        <Text style={styles.body}>
          This build has no Supabase project configured. Copy .env.example to .env, fill in your
          project's URL and anon key from Project Settings → API, and restart the app.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.hero,
    fontSize: 28,
    lineHeight: 32,
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  body: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: 320,
  },
});
