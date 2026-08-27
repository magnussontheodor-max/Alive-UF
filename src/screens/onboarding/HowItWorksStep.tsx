import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';
import { HowItWorksCarousel } from './HowItWorksCarousel';

export function HowItWorksStep() {
  return (
    <View>
      <Text style={styles.title}>How it works</Text>
      <HowItWorksCarousel />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.hero,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
});
