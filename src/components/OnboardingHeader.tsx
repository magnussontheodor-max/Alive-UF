import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { OnboardingProgress } from './OnboardingProgress';

type Props = {
  step: number;
  totalSteps: number;
  onBack: () => void;
};

export function OnboardingHeader({ step, totalSteps, onBack }: Props) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Back">
        <Text style={styles.back}>‹ Back</Text>
      </Pressable>
      <OnboardingProgress total={totalSteps} current={step} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  back: {
    ...typography.label,
    color: colors.inkMuted,
  },
});
