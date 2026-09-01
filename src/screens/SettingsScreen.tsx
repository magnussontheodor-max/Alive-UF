import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckInTimeStep } from './onboarding/CheckInTimeStep';
import { ContactsStep } from './onboarding/ContactsStep';
import { GracePeriodStep } from './onboarding/GracePeriodStep';
import { LegalScreen } from './LegalScreen';
import { PersonaStep } from './onboarding/PersonaStep';
import { DemoFooter } from '../components/DemoFooter';
import { TextField } from '../components/TextField';
import { supabase } from '../lib/supabase';
import { useAuth } from '../state/AuthContext';
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
 * normal settings screen works. Reuses every onboarding step component
 * directly rather than re-implementing the same fields: they only care
 * about `value`/`onChange`, not whether that's a local draft
 * (onboarding) or the real profile (here).
 */
export function SettingsScreen({ onBack, onOpenHowItWorks }: Props) {
  const profile = useProfile();
  const { session, deleteAccount } = useAuth();
  const { reset: resetCheckIn } = useCheckIn();
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRestartOnboarding = () => {
    resetCheckIn();
    profile.restartOnboarding();
  };

  // GDPR Art. 15/20 — access and portability. Everything queried here
  // is already scoped to this account by RLS (owner_id = auth.uid()),
  // so there's nothing to filter client-side; this is genuinely every
  // row that exists about this person.
  const handleDownloadData = async () => {
    const userId = session?.user.id;
    if (!userId || isExporting) return;
    setIsExporting(true);
    try {
      const [profileResult, contactsResult, checkInsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('trusted_contacts').select('*').eq('owner_id', userId),
        supabase.from('check_ins').select('day, checked_in_at').eq('user_id', userId).order('day'),
      ]);
      if (profileResult.error) throw profileResult.error;
      if (contactsResult.error) throw contactsResult.error;
      if (checkInsResult.error) throw checkInsResult.error;

      const exportPayload = {
        exported_at: new Date().toISOString(),
        account_email: session?.user.email ?? null,
        profile: profileResult.data,
        trusted_contacts: contactsResult.data ?? [],
        check_ins: checkInsResult.data ?? [],
      };

      await Share.share({
        title: 'My ALIVE data',
        message: JSON.stringify(exportPayload, null, 2),
      });
    } catch (e) {
      Alert.alert(
        'Export failed',
        e instanceof Error ? e.message : "Couldn't put your data together. Try again in a moment."
      );
    } finally {
      setIsExporting(false);
    }
  };

  // GDPR Art. 17 — right to erasure. Confirmed once, destructively,
  // then irreversible — see deleteAccount() in AuthContext and
  // delete_own_account() in supabase/migrations/0002_gdpr.sql for what
  // it actually removes.
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete your account?',
      'This permanently deletes your profile, trusted contacts, and check-in history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAccount();
              // No further navigation needed here — App.tsx's AuthGate
              // reacts to the session disappearing on its own and
              // drops straight back to SignInScreen.
            } catch (e) {
              setIsDeleting(false);
              Alert.alert(
                'Couldn’t delete your account',
                e instanceof Error ? e.message : 'Try again in a moment.'
              );
            }
          },
        },
      ]
    );
  };

  if (legalDoc) {
    return <LegalScreen doc={legalDoc} onBack={() => setLegalDoc(null)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Your details.</Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>WHO ALIVE IS FOR</Text>
            <PersonaStep value={profile.subjectMode} onChange={profile.setSubjectMode} title={null} subtitle={null} />
          </View>

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
            <Text style={styles.sectionLabel}>CHECK-IN TIME</Text>
            <CheckInTimeStep
              value={profile.checkInWindow}
              onChange={profile.setCheckInWindow}
              title={null}
              subtitle={null}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>GRACE PERIOD</Text>
            <GracePeriodStep
              value={profile.graceMinutes}
              onChange={profile.setGraceMinutes}
              title={null}
              subtitle={null}
            />
          </View>

          <Pressable onPress={onOpenHowItWorks} style={[styles.section, styles.linkRowWrap]}>
            <Text style={styles.linkRow}>How ALIVE works</Text>
            <Text style={styles.linkChevron}>›</Text>
          </Pressable>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PRIVACY</Text>
            <Pressable onPress={() => setLegalDoc('privacy')} style={styles.linkRowWrap}>
              <Text style={styles.linkRow}>Privacy Policy</Text>
              <Text style={styles.linkChevron}>›</Text>
            </Pressable>
            <Pressable onPress={() => setLegalDoc('terms')} style={[styles.linkRowWrap, styles.linkRowSpaced]}>
              <Text style={styles.linkRow}>Terms of Service</Text>
              <Text style={styles.linkChevron}>›</Text>
            </Pressable>
            <Pressable onPress={handleDownloadData} disabled={isExporting} style={[styles.linkRowWrap, styles.linkRowSpaced]}>
              <Text style={styles.linkRow}>{isExporting ? 'Preparing…' : 'Download my data'}</Text>
              <Text style={styles.linkChevron}>›</Text>
            </Pressable>
            <Pressable
              onPress={handleDeleteAccount}
              disabled={isDeleting}
              style={[styles.linkRowWrap, styles.linkRowSpaced]}
            >
              <Text style={styles.destructiveRow}>{isDeleting ? 'Deleting…' : 'Delete my account'}</Text>
            </Pressable>
          </View>

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
  linkRowSpaced: {
    marginTop: spacing.md,
  },
  destructiveRow: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '600',
  },
  footer: {
    marginTop: spacing.xxxl,
  },
});
