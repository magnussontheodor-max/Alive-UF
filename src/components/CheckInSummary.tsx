import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Row = {
  label: string;
  value: string;
};

/**
 * A tracked-caps label stacked above a big serif value — a "stat
 * block" rather than a label/value pair sharing one line. This is
 * more robust than side-by-side as the value gets longer ("Tomorrow
 * evening" vs. "07:48") and it fits the bolder type direction: the
 * value gets to be as big as the rest of the app's headlines.
 */
export function CheckInSummary({ rows }: { rows: Row[] }) {
  return (
    <View style={styles.container}>
      {rows.map((row, index) => (
        <View key={row.label} style={[styles.row, index > 0 && styles.rowDivider]}>
          <Text style={styles.label}>{row.label.toUpperCase()}</Text>
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
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  label: {
    ...typography.label,
    color: colors.inkMuted,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.value,
    color: colors.ink,
  },
});
