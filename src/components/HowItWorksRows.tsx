import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { HOW_IT_WORKS } from '../data/howItWorks';

/**
 * The three-step mechanism, as a numbered stacked list — same "small
 * label, bigger content below it" rhythm as CheckInSummary, reused
 * here as a number instead of a tracked-caps label.
 */
export function HowItWorksRows() {
  return (
    <View style={styles.container}>
      {HOW_IT_WORKS.map((item, index) => (
        <View key={item.number} style={[styles.row, index > 0 && styles.rowDivider]}>
          <Text style={styles.number}>{item.number}</Text>
          <Text style={styles.headline}>{item.headline}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    paddingVertical: spacing.lg,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  number: {
    ...typography.label,
    color: colors.inkFaint,
    marginBottom: spacing.xs,
  },
  headline: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '600',
  },
  description: {
    ...typography.bodyMuted,
    color: colors.inkMuted,
    marginTop: spacing.xs,
  },
});
