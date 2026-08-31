import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OptionCard } from '../../components/OptionCard';
import { colors, spacing, typography } from '../../theme';

type Props = {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
};

/**
 * The one gate GDPR actually requires before onboarding can collect
 * anything further: a recorded, affirmative "I agree" — never a
 * pre-checked box — to the Privacy Policy and Terms, with both
 * actually readable from here, not just linked to a store listing.
 * ProfileContext writes the acceptance timestamp (and which policy
 * version) once onboarding finishes; see acceptPrivacyPolicy there.
 */
export function ConsentStep({ accepted, onChange, onOpenPrivacy, onOpenTerms }: Props) {
  return (
    <View>
      <Text style={styles.title}>Before we start.</Text>
      <Text style={styles.subtitle}>
        Here's exactly what ALIVE stores and who it's shared with — worth two minutes before your first check-in.
      </Text>

      <View style={styles.links}>
        <Pressable onPress={onOpenPrivacy} hitSlop={8}>
          <Text style={styles.link}>Read the Privacy Policy</Text>
        </Pressable>
        <Pressable onPress={onOpenTerms} hitSlop={8}>
          <Text style={styles.link}>Read the Terms of Service</Text>
        </Pressable>
      </View>

      <View style={styles.option}>
        <OptionCard
          label="I agree to the Privacy Policy and Terms of Service"
          selected={accepted}
          onSelect={() => onChange(!accepted)}
          accessibilityLabel="I agree to the Privacy Policy and Terms of Service"
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
  links: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  link: {
    ...typography.body,
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  option: {
    marginTop: spacing.xl,
  },
});
