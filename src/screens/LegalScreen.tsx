import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PRIVACY_POLICY_TEXT, PRIVACY_POLICY_TITLE, TERMS_TEXT, TERMS_TITLE } from '../legal/content';
import { colors, spacing, typography } from '../theme';

type Props = {
  doc: 'privacy' | 'terms';
  onBack: () => void;
};

/**
 * Renders the Privacy Policy or Terms of Service — reached from
 * ConsentStep during onboarding and from Settings afterward, so
 * there's exactly one place either document is ever displayed. The
 * text itself lives in src/legal/content.ts, not here.
 */
export function LegalScreen({ doc, onBack }: Props) {
  const title = doc === 'privacy' ? PRIVACY_POLICY_TITLE : TERMS_TITLE;
  const body = doc === 'privacy' ? PRIVACY_POLICY_TEXT : TERMS_TEXT;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
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
    marginBottom: spacing.lg,
  },
  body: {
    ...typography.body,
    color: colors.inkMuted,
    lineHeight: 24,
  },
});
