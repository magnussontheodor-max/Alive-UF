import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { HowItWorksRows } from '../../components/HowItWorksRows';
import { colors, spacing, typography } from '../../theme';

/** The same three-point explainer shown here and, later, from Settings — see HowItWorksRows. */
export function HowItWorksStep() {
  return (
    <View>
      <Text style={styles.title}>How it works</Text>
      <HowItWorksRows />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.hero,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
});
