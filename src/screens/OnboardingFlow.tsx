import React, { useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '../components/OnboardingHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useEntranceStyle } from '../hooks/useEntranceStyle';
import { useProfile } from '../state/ProfileContext';
import { colors, spacing } from '../theme';
import type { CheckInWindow } from '../types/profile';
import { CheckInWindowStep } from './onboarding/CheckInWindowStep';
import { TextStep } from './onboarding/TextStep';
import { WelcomeStep } from './onboarding/WelcomeStep';

const STEPS = ['welcome', 'name', 'contact', 'window'] as const;
type Step = (typeof STEPS)[number];

/**
 * A short, linear wizard — welcome, your name, your trusted contact,
 * your check-in window — then straight into the real app. Each step
 * writes into local component state (`draft`), and only the final step
 * commits it to ProfileContext via completeOnboarding(). No navigation
 * library: four screens with one "next/back" relationship don't need
 * one yet (see ARCHITECTURE.md).
 */
export function OnboardingFlow() {
  const profile = useProfile();
  const [stepIndex, setStepIndex] = useState(0);
  const [nameDraft, setNameDraft] = useState(profile.userName);
  const [contactDraft, setContactDraft] = useState(profile.contactName);
  const [windowDraft, setWindowDraft] = useState<CheckInWindow>(profile.checkInWindow);

  const step: Step = STEPS[stepIndex];
  const entranceStyle = useEntranceStyle(step, { duration: 360 });

  const canContinue =
    step !== 'name' || nameDraft.trim().length > 0;
  const canFinish = contactDraft.trim().length > 0;

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleFinish = () => {
    profile.setUserName(nameDraft.trim());
    profile.setContactName(contactDraft.trim());
    profile.setCheckInWindow(windowDraft);
    profile.completeOnboarding();
  };

  const primaryLabel =
    step === 'welcome' ? 'Get started' : step === 'window' ? 'Start using ALIVE' : 'Continue';

  const primaryDisabled =
    (step === 'name' && nameDraft.trim().length === 0) ||
    (step === 'contact' && contactDraft.trim().length === 0);

  const handlePrimaryPress = step === 'window' ? handleFinish : goNext;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.top}>
            {step === 'welcome' ? null : (
              <OnboardingHeader step={stepIndex - 1} totalSteps={STEPS.length - 1} onBack={goBack} />
            )}
          </View>

          <Animated.View style={[styles.content, entranceStyle]}>
            {step === 'welcome' && <WelcomeStep />}
            {step === 'name' && (
              <TextStep
                title="What should we call you?"
                subtitle="This is how ALIVE will greet you each day."
                value={nameDraft}
                onChangeText={setNameDraft}
                placeholder="Your name"
                onSubmitEditing={canContinue ? goNext : undefined}
              />
            )}
            {step === 'contact' && (
              <TextStep
                title="Who should know you're okay?"
                subtitle="We'll only ever reach out to them if you miss a check-in."
                value={contactDraft}
                onChangeText={setContactDraft}
                placeholder="Their name"
                onSubmitEditing={canFinish ? handleFinish : undefined}
              />
            )}
            {step === 'window' && (
              <CheckInWindowStep value={windowDraft} onChange={setWindowDraft} />
            )}
          </Animated.View>

          <View style={styles.bottom}>
            <PrimaryButton label={primaryLabel} onPress={handlePrimaryPress} disabled={primaryDisabled} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
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
    justifyContent: 'center',
  },
  bottom: {
    paddingBottom: spacing.lg,
  },
});
