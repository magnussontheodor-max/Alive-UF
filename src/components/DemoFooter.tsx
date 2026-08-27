import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = {
  /** Shown only when there is a check-in to reset. */
  onResetCheckIn?: () => void;
  /** Always offered on the home screen — a way back into onboarding for testing. */
  onRestartOnboarding?: () => void;
};

/**
 * Two jobs, both required by the product spec:
 *
 * 1. Say plainly what actually happens: check-ins are saved for real
 *    now (Supabase, not local-only state), and a trusted contact is
 *    genuinely notified by push once they've accepted an invite —
 *    but only if they have ALIVE installed too. That limitation is
 *    real, not a demo disclaimer, so it stays here as long as it's
 *    true. This is real product copy, not a developer note, so it
 *    stays quiet and out of the way of the primary experience rather
 *    than being an alarming banner.
 * 2. Offer ways to reset check-in/onboarding state for testing,
 *    visually separated from the real flow so neither ever reads as a
 *    product feature.
 */
export function DemoFooter({ onResetCheckIn, onRestartOnboarding }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.notice}>
        Trusted contacts are notified by push — they'll need ALIVE installed too.
      </Text>
      <View style={styles.links}>
        {onResetCheckIn ? (
          <Pressable onPress={onResetCheckIn} hitSlop={8}>
            <Text style={styles.link}>Reset check-in (testing)</Text>
          </Pressable>
        ) : null}
        {onRestartOnboarding ? (
          <Pressable onPress={onRestartOnboarding} hitSlop={8}>
            <Text style={styles.link}>Restart onboarding (testing)</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  notice: {
    ...typography.caption,
    color: colors.inkFaint,
    textAlign: 'center',
    maxWidth: 260,
  },
  links: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  link: {
    ...typography.caption,
    color: colors.inkMuted,
    letterSpacing: 0.6,
    textDecorationLine: 'underline',
  },
});
