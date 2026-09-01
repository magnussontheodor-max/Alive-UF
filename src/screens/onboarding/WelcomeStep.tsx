import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Wordmark } from '../../components/Wordmark';
import { colors, spacing, typography } from '../../theme';

export function WelcomeStep() {
  return (
    <View style={styles.container}>
      <Wordmark size="large" />
      <Text style={styles.headline}>You don't have to wonder if they're okay.</Text>
      <Text style={styles.tagline}>
        ALIVE is a quiet, daily way to know — and let the people who love you know the same about
        you. One tap a day. That's the whole thing.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  headline: {
    ...typography.hero,
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  tagline: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    maxWidth: 300,
  },
});
