import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = {
  /** Shown only when there is something to reset. */
  onReset?: () => void;
};

/**
 * Two jobs, both required by the product spec:
 *
 * 1. Make it unmistakable that this build is a local demo — no message
 *    ever actually reaches a trusted contact yet. This is real product
 *    copy, not a developer note, so it stays quiet and out of the way
 *    of the primary experience rather than being an alarming banner.
 * 2. Offer a way to reset the demo check-in for testing, visually
 *    separated from the real flow so it never reads as a product
 *    feature.
 */
export function DemoFooter({ onReset }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.notice}>
        Demo build — check-ins stay on this device. No one is notified yet.
      </Text>
      {onReset ? (
        <Pressable onPress={onReset} hitSlop={8}>
          <Text style={styles.reset}>Reset check-in (testing)</Text>
        </Pressable>
      ) : null}
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
  reset: {
    ...typography.caption,
    color: colors.inkMuted,
    textDecorationLine: 'underline',
  },
});
