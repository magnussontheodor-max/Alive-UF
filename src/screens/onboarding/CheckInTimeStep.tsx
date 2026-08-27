import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { WheelPicker } from '../../components/WheelPicker';
import { colors, spacing, typography } from '../../theme';
import type { CheckInWindow } from '../../types/profile';

type Props = {
  value: CheckInWindow;
  onChange: (window: CheckInWindow) => void;
  /** Omit for the onboarding copy (default); pass null to hide the heading — used when Settings supplies its own section label. */
  title?: string | null;
  subtitle?: string | null;
};

const DEFAULT_TITLE = 'When should we check in?';
const DEFAULT_SUBTITLE = "Scroll to the time that fits your day. We'll remind you a little before it.";

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

/**
 * A precise time, chosen on two scroll wheels, rather than picking one
 * of three fixed blocks (morning/afternoon/evening). Reused as-is in
 * Settings; only knows about `value`/`onChange`, not where the choice
 * ends up.
 */
export function CheckInTimeStep({
  value,
  onChange,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
}: Props) {
  const minuteIndex = Math.round(value.minute / 15) % 4;

  return (
    <View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={[styles.pickerRow, !title && styles.pickerRowNoTitle]}>
        <WheelPicker
          items={HOURS}
          selectedIndex={value.hour}
          onChange={(hour) => onChange({ ...value, hour })}
          accessibilityLabel="Hour"
        />
        <Text style={styles.colon}>:</Text>
        <WheelPicker
          items={MINUTES}
          selectedIndex={minuteIndex}
          onChange={(index) => onChange({ ...value, minute: index * 15 })}
          accessibilityLabel="Minute"
        />
      </View>
      <Text style={styles.hint}>Tap a number, or scroll to it.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.hero,
    color: colors.ink,
  },
  subtitle: {
    ...typography.body,
    color: colors.inkMuted,
    marginTop: spacing.sm,
  },
  pickerRow: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pickerRowNoTitle: {
    marginTop: 0,
  },
  colon: {
    ...typography.hero,
    fontSize: 32,
    color: colors.inkFaint,
  },
  hint: {
    ...typography.caption,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
