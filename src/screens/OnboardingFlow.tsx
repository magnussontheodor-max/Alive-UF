import React, { useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingHeader } from '../components/OnboardingHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useEntranceStyle } from '../hooks/useEntranceStyle';
import { useProfile } from '../state/ProfileContext';
import { colors, spacing } from '../theme';
import type { CheckInWindow, SubjectMode, TrustedContact } from '../types/profile';
import { CheckInTimeStep } from './onboarding/CheckInTimeStep';
import { ContactsStep } from './onboarding/ContactsStep';
import { GracePeriodStep } from './onboarding/GracePeriodStep';
import { HowItWorksStep } from './onboarding/HowItWorksStep';
import { PersonaStep } from './onboarding/PersonaStep';
import { TextStep } from './onboarding/TextStep';
import { WelcomeStep } from './onboarding/WelcomeStep';

const STEPS = ['welcome', 'howItWorks', 'persona', 'name', 'contacts', 'time', 'grace'] as const;
type Step = (typeof STEPS)[number];

const EMPTY_CONTACT: TrustedContact = { name: '', phone: '' };

/**
 * A short, linear wizard — welcome, how it works, who this is for,
 * your name, your trusted contact(s), your check-in time, your grace
 * period — then straight into the real app. Each step writes into
 * local component state (`draft`), and only the final step commits it
 * to ProfileContext via completeOnboarding(). No navigation library: a
 * handful of screens with one "next/back" relationship don't need one
 * yet (see ARCHITECTURE.md).
 */
export function OnboardingFlow() {
  const profile = useProfile();
  const [stepIndex, setStepIndex] = useState(0);
  const [subjectModeDraft, setSubjectModeDraft] = useState<SubjectMode>(profile.subjectMode);
  const [nameDraft, setNameDraft] = useState(profile.userName);
  const [contactsDraft, setContactsDraft] = useState<TrustedContact[]>(
    profile.contacts.length > 0 ? profile.contacts : [EMPTY_CONTACT]
  );
  const [timeDraft, setTimeDraft] = useState<CheckInWindow>(profile.checkInWindow);
  const [graceDraft, setGraceDraft] = useState<number>(profile.graceMinutes);

  const step: Step = STEPS[stepIndex];
  const entranceStyle = useEntranceStyle(step, { duration: 360 });

  const canContinueName = nameDraft.trim().length > 0;
  const canContinueContacts = contactsDraft.every(
    (contact) => contact.name.trim().length > 0 && contact.phone.trim().length > 0
  );

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleFinish = () => {
    profile.setSubjectMode(subjectModeDraft);
    profile.setUserName(nameDraft.trim());
    profile.setContacts(contactsDraft.map((c) => ({ name: c.name.trim(), phone: c.phone.trim() })));
    profile.setCheckInWindow(timeDraft);
    profile.setGraceMinutes(graceDraft);
    profile.completeOnboarding();
  };

  const primaryLabel =
    step === 'welcome' ? 'Get started' : step === 'grace' ? 'Start using ALIVE' : 'Continue';

  const primaryDisabled =
    (step === 'name' && !canContinueName) || (step === 'contacts' && !canContinueContacts);

  const handlePrimaryPress = step === 'grace' ? handleFinish : goNext;

  // The one piece of copy that actually branches on `persona` — see
  // PersonaStep's doc comment for why the rest of onboarding doesn't.
  const isOther = subjectModeDraft === 'other';
  const nameTitle = isOther ? "What's their name?" : 'What should we call you?';
  const nameSubtitle = isOther
    ? 'This is how ALIVE will greet them each day.'
    : 'This is how ALIVE will greet you each day.';
  const contactsTitle = isOther ? 'Who should we tell?' : "Who should know you're okay?";
  const contactsSubtitle = isOther
    ? "Add yourself and anyone else who should hear from us if a check-in is missed."
    : "Add one or two people you trust. We'll only ever reach out to them if you miss a check-in.";
  const timeTitle = isOther ? 'When should they check in?' : 'When should we check in?';
  const timeSubtitle = isOther
    ? "Pick the time that fits their day. We'll remind them a little before it."
    : "Scroll to the time that fits your day. We'll remind you a little before it.";
  const graceTitle = isOther ? 'If they miss it, how long should we wait?' : 'If you miss it, how long should we wait?';

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

          <Animated.ScrollView
            style={[styles.content, entranceStyle]}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 'welcome' && <WelcomeStep />}
            {step === 'howItWorks' && <HowItWorksStep />}
            {step === 'persona' && <PersonaStep value={subjectModeDraft} onChange={setSubjectModeDraft} />}
            {step === 'name' && (
              <TextStep
                title={nameTitle}
                subtitle={nameSubtitle}
                value={nameDraft}
                onChangeText={setNameDraft}
                placeholder={isOther ? 'Their name' : 'Your name'}
                onSubmitEditing={canContinueName ? goNext : undefined}
              />
            )}
            {step === 'contacts' && (
              <ContactsStep
                contacts={contactsDraft}
                onChange={setContactsDraft}
                title={contactsTitle}
                subtitle={contactsSubtitle}
              />
            )}
            {step === 'time' && (
              <CheckInTimeStep value={timeDraft} onChange={setTimeDraft} title={timeTitle} subtitle={timeSubtitle} />
            )}
            {step === 'grace' && (
              <GracePeriodStep value={graceDraft} onChange={setGraceDraft} title={graceTitle} />
            )}
          </Animated.ScrollView>

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
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  bottom: {
    paddingBottom: spacing.lg,
  },
});
