import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Row = {
  label: string;
  value: string;
};

/**
 * Two quiet lines of fact beneath the main confirmation — when today's
 * check-in happened, and when the next one is expected. No cards, no
 * icons, just aligned text, the way a well-set receipt or ticket reads.
 */
export function CheckInSummary({ rows }: { rows: Row[] }) {
  return (
    <View style={styles.container}>
      {rows.map((row, index) => (
        <View
          key={row.label}
          style={[styles.row, index > 0 && styles.rowDivider]}
        >
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
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
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  label: {
    ...typography.bodyMuted,
    color: colors.inkMuted,
  },
  value: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '500',
  },
});
