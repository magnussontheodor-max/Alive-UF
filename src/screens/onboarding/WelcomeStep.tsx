import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Wordmark } from '../../components/Wordmark';
import { colors, spacing, typography } from '../../theme';

export function WelcomeStep() {
  return (
    <View style={styles.container}>
      <Wordmark size="large" />
      <Text style={styles.tagline}>
        A quiet way to let the people who matter know you're okay.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  tagline: {
    ...typography.body,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    maxWidth: 280,
  },
});
