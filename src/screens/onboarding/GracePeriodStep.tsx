import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OptionCard } from '../../components/OptionCard';
import { colors, spacing, typography } from '../../theme';
import { GRACE_OPTIONS } from '../../types/profile';

type Props = {
  value: number;
  onChange: (minutes: number) => void;
  /** Omit for the onboarding copy (default); pass null to hide the heading — used when Settings supplies its own section label. */
  title?: string | null;
  subtitle?: string | null;
};

const DEFAULT_TITLE = 'If you miss it, how long should we wait?';
const DEFAULT_SUBTITLE =
  "This is how much time passes before anyone else is told. A grace period, not a countdown to worry.";

/** Reused as-is in Settings; only knows about `value`/`onChange`. */
export function GracePeriodStep({
  value,
  onChange,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
}: Props) {
  return (
    <View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={[styles.options, !title && styles.optionsNoTitle]}>
        {GRACE_OPTIONS.map((option) => (
          <OptionCard
            key={option.id}
            label={option.label}
            description={option.description}
            selected={option.minutes === value}
            onSelect={() => onChange(option.minutes)}
          />
        ))}
      </View>
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
  options: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  optionsNoTitle: {
    marginTop: 0,
  },
});
