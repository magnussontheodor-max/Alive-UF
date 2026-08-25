import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme';

type Props = {
  total: number;
  current: number;
};

/** Three quiet dots — enough to signal "this is short", not a step counter to read. */
export function OnboardingProgress({ total, current }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === current ? styles.dotActive : styles.dotInactive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: colors.accent,
  },
  dotInactive: {
    backgroundColor: colors.hairline,
  },
});
