import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckInWindowStep } from './onboarding/CheckInWindowStep';
import { ContactsStep } from './onboarding/ContactsStep';
import { DemoFooter } from '../components/DemoFooter';
import { TextField } from '../components/TextField';
import { useCheckIn } from '../state/CheckInContext';
import { useProfile } from '../state/ProfileContext';
import { colors, spacing, typography } from '../theme';

type Props = {
  onBack: () => void;
  onOpenHowItWorks: () => void;
};

/**
 * Everything onboarding collected, editable afterward, live — no
 * draft/save step, changes apply as you type/tap, the same way a
 * normal settings screen works. Reuses ContactsStep and
 * CheckInWindowStep directly rather than re-implementing the same
 * fields: they only care about `value`/`onChange`, not whether that's
 * a local draft (onboarding) or the real profile (here).
 */
export function SettingsScreen({ onBack, onOpenHowItWorks }: Props) {
  const profile = useProfile();
  const { reset: resetCheckIn } = useCheckIn();

  const handleRestartOnboarding = () => {
    resetCheckIn();
    profile.restartOnboarding();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Your details.</Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>NAME</Text>
            <TextField
              size="compact"
              value={profile.userName}
              onChangeText={profile.setUserName}
              placeholder="Your name"
              returnKeyType="done"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TRUSTED CONTACTS</Text>
            <ContactsStep
              contacts={profile.contacts}
              onChange={profile.setContacts}
              title={null}
              subtitle={null}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CHECK-IN WINDOW</Text>
            <CheckInWindowStep
              value={profile.checkInWindow}
              onChange={profile.setCheckInWindow}
              title={null}
              subtitle={null}
            />
          </View>

          <Pressable onPress={onOpenHowItWorks} style={[styles.section, styles.linkRowWrap]}>
            <Text style={styles.linkRow}>How ALIVE works</Text>
            <Text style={styles.linkChevron}>›</Text>
          </Pressable>

          <View style={styles.footer}>
            <DemoFooter onRestartOnboarding={handleRestartOnboarding} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  back: {
    paddingTop: spacing.lg,
    alignSelf: 'flex-start',
  },
  backText: {
    ...typography.label,
    color: colors.inkMuted,
  },
  scrollContent: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.hero,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  section: {
    marginTop: spacing.xxl,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.inkFaint,
    marginBottom: spacing.md,
  },
  linkRowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkRow: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '600',
  },
  linkChevron: {
    ...typography.body,
    color: colors.inkFaint,
  },
  footer: {
    marginTop: spacing.xxxl,
  },
});
