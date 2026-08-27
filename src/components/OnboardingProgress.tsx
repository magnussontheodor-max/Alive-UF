import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme';

type Props = {
  total: number;
  current: number;
  /** If provided, each dot becomes tappable and jumps straight to that index — used by the how-it-works carousel, not the top step-progress row. */
  onSelect?: (index: number) => void;
};

/** Three quiet dots — enough to signal "this is short", not a step counter to read. */
export function OnboardingProgress({ total, current, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) =>
        onSelect ? (
          <Pressable key={index} onPress={() => onSelect(index)} hitSlop={8}>
            <View style={[styles.dot, index === current ? styles.dotActive : styles.dotInactive]} />
          </Pressable>
        ) : (
          <View
            key={index}
            style={[styles.dot, index === current ? styles.dotActive : styles.dotInactive]}
          />
        )
      )}
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
