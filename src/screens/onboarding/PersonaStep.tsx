import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OptionCard } from '../../components/OptionCard';
import { colors, spacing, typography } from '../../theme';
import type { SubjectMode } from '../../types/profile';

type Props = {
  value: SubjectMode;
  onChange: (mode: SubjectMode) => void;
  /** Omit for the onboarding copy (default); pass null to hide the heading — used when Settings supplies its own section label. */
  title?: string | null;
  subtitle?: string | null;
};

const DEFAULT_TITLE = "Who's this for?";
const DEFAULT_SUBTITLE = 'Changes a little of what we ask next — nothing else.';

/**
 * Self-check-in versus setting ALIVE up for someone else (a parent,
 * partner, friend). Deliberately lightweight: the app is still one
 * person pressing one button on one phone either way — this only
 * changes how the rest of onboarding talks to whoever's setting it up.
 * Reused as-is in Settings.
 */
export function PersonaStep({ value, onChange, title = DEFAULT_TITLE, subtitle = DEFAULT_SUBTITLE }: Props) {
  return (
    <View>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={[styles.options, !title && styles.optionsNoTitle]}>
        <OptionCard
          label="Myself"
          description="You'll be the one checking in, every day."
          selected={value === 'self'}
          onSelect={() => onChange('self')}
        />
        <OptionCard
          label="Someone I care about"
          description="A parent, partner, or friend — they'll check in; you'll be listed as a contact."
          selected={value === 'other'}
          onSelect={() => onChange('other')}
        />
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
