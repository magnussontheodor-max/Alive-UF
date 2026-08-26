import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { CheckInStatus } from '../utils/checkInStatus';

type Option = { id: CheckInStatus; label: string };

const OPTIONS: Option[] = [
  { id: 'open', label: 'On time' },
  { id: 'closingSoon', label: 'Closing soon' },
  { id: 'missed', label: 'Missed' },
  { id: 'escalated', label: 'Escalated' },
];

type Props = {
  /** null = use the real clock. */
  activeStatus: CheckInStatus | null;
  onSelect: (status: CheckInStatus | null) => void;
};

/**
 * Testing only — jumps the screen straight to what it would look like
 * at each point in the escalation timeline, since nobody demoing this
 * wants to wait a real hour to see "escalated". Lets the underlying
 * getCheckInStatus() logic stay real: this only overrides what time it
 * thinks it is, not the state itself.
 */
export function StatusPreview({ activeStatus, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview status (testing)</Text>
      <View style={styles.row}>
        <Pressable onPress={() => onSelect(null)} hitSlop={6}>
          <Text style={[styles.option, activeStatus === null && styles.optionActive]}>Live</Text>
        </Pressable>
        {OPTIONS.map((option) => (
          <Pressable key={option.id} onPress={() => onSelect(option.id)} hitSlop={6}>
            <Text style={[styles.option, activeStatus === option.id && styles.optionActive]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    ...typography.caption,
    color: colors.inkFaint,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  option: {
    ...typography.caption,
    color: colors.inkMuted,
    textDecorationLine: 'underline',
  },
  optionActive: {
    color: colors.accent,
    fontWeight: '700',
  },
});
