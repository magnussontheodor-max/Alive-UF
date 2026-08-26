import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors, typography } from '../theme';

type Props = {
  /** 'small' (default) is the quiet in-app mark; 'large' is for the onboarding welcome moment. */
  size?: 'small' | 'large';
};

/**
 * The brand mark — quiet and small everywhere except the very first
 * screen a new user sees. Not a logo lockup, just the name set well.
 */
export function Wordmark({ size = 'small' }: Props) {
  return <Text style={size === 'large' ? styles.large : styles.small}>ALIVE</Text>;
}

const styles = StyleSheet.create({
  small: {
    ...typography.wordmark,
    color: colors.inkMuted,
  },
  large: {
    ...typography.wordmark,
    color: colors.ink,
    fontSize: 52,
    letterSpacing: 9,
  },
});
