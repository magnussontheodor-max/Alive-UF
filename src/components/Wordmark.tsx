import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors, typography } from '../theme';

/**
 * The smallest possible brand mark — quiet, present on the one screen
 * that exists today, easy to ignore. Not a logo lockup, just the name
 * set well.
 */
export function Wordmark() {
  return <Text style={styles.text}>ALIVE</Text>;
}

const styles = StyleSheet.create({
  text: {
    ...typography.wordmark,
    color: colors.inkMuted,
  },
});
