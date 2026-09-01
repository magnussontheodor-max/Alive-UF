import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '../components/OnboardingHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useEntranceStyle } from '../hooks/useEntranceStyle';
import { colors, spacing, typography } from '../theme';
import type { SubjectMode } from '../types/profile';
import { ConsentStep } from './onboarding/ConsentStep';
import { HowItWorksStep } from './onboarding/HowItWorksStep';
import { LegalScreen } from './LegalScreen';
import { PersonaStep } from './onboarding/PersonaStep';
import { WelcomeStep } from './onboarding/WelcomeStep';

const STEPS = ['welcome', 'consent', 'howItWorks', 'persona'] as const;
type Step = (typeof STEPS)[number];

export type PreAuthDraft = {
  subjectMode: SubjectMode;
  privacyAccepted: boolean;
};

type Props = {
  /** Called once, after persona's "Continue" — hands the accumulated draft up to AuthGate to carry across sign-in. */
  onDone: (draft: PreAuthDraft) => void;
  /** The welcome-step escape hatch for a returning person — see the link below. */
  onSkipToSignIn: () => void;
};

/**
 * The part of onboarding that makes sense *before* anyone has signed
 * in: the pitch (welcome), consent, how it works, and who this is for.
 * None of that needs an account to ask — it only needs somewhere to
 * hold the answers until one exists. Sign-in itself sits after this,
 * not before it (see App.tsx's AuthGate and ARCHITECTURE.md), so a
 * brand-new person meets the product before being asked to create an
 * account for it. Same local-draft-until-handoff shape as
 * OnboardingFlow, just committed to `onDone` instead of ProfileContext
 * — there's no profile to write to yet.
 */
export function PreAuthOnboarding({ onDone, onSkipToSignIn }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [consentDraft, setConsentDraft] = useState(false);
  const [subjectModeDraft, setSubjectModeDraft] = useState<SubjectMode>('self');
  // Same reasoning as OnboardingFlow's legalDoc: reading the Privacy
  // Policy or Terms mid-flow replaces the whole screen rather than
  // being a step of its own.
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | null>(null);

  const step: Step = STEPS[stepIndex];
  const entranceStyle = useEntranceStyle(step, { duration: 360 });

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleFinish = () => {
    onDone({ subjectMode: subjectModeDraft, privacyAccepted: consentDraft });
  };

  const primaryLabel = step === 'welcome' ? 'Get started' : 'Continue';
  const primaryDisabled = step === 'consent' && !consentDraft;
  const handlePrimaryPress = step === 'persona' ? handleFinish : goNext;

  if (legalDoc) {
    return <LegalScreen doc={legalDoc} onBack={() => setLegalDoc(null)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.top}>
          {step === 'welcome' ? null : (
            <OnboardingHeader step={stepIndex - 1} totalSteps={STEPS.length - 1} onBack={goBack} />
          )}
        </View>

        <Animated.ScrollView
          style={[styles.content, entranceStyle]}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {step === 'welcome' && <WelcomeStep />}
          {step === 'consent' && (
            <ConsentStep
              accepted={consentDraft}
              onChange={setConsentDraft}
              onOpenPrivacy={() => setLegalDoc('privacy')}
              onOpenTerms={() => setLegalDoc('terms')}
            />
          )}
          {step === 'howItWorks' && <HowItWorksStep />}
          {step === 'persona' && <PersonaStep value={subjectModeDraft} onChange={setSubjectModeDraft} />}
        </Animated.ScrollView>

        <View style={styles.bottom}>
          <PrimaryButton label={primaryLabel} onPress={handlePrimaryPress} disabled={primaryDisabled} />
          {step === 'welcome' ? (
            // Quiet, secondary — a returning person re-authenticating
            // shouldn't have to sit through the pitch/consent/persona
            // screens again just to get back to their account. Kept
            // low-key on purpose (see DemoFooter/SettingsScreen's link
            // rows) so it never competes with "Get started".
            <Pressable onPress={onSkipToSignIn} hitSlop={8} style={styles.skipLink}>
              <Text style={styles.skipLinkText}>Already have an account? Sign in</Text>
            </Pressable>
          ) : null}
        </View>
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
  top: {
    paddingTop: spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  bottom: {
    paddingBottom: spacing.lg,
  },
  skipLink: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  skipLinkText: {
    ...typography.caption,
    color: colors.inkMuted,
    letterSpacing: 0.6,
    textDecorationLine: 'underline',
  },
});
