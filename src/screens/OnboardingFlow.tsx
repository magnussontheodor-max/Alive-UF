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
import { ConsentStep } from './onboarding/ConsentStep';
import { ContactsStep } from './onboarding/ContactsStep';
import { GracePeriodStep } from './onboarding/GracePeriodStep';
import { LegalScreen } from './LegalScreen';
import { PersonaStep } from './onboarding/PersonaStep';
import type { PreAuthDraft } from './PreAuthOnboarding';
import { TextStep } from './onboarding/TextStep';

// Welcome, consent, how-it-works, and persona normally happen *before*
// sign-in now (PreAuthOnboarding — see App.tsx's AuthGate and
// ARCHITECTURE.md), so this wizard's usual path starts at `name`.
// `consent`/`persona` only reappear here as a fallback — see
// `hasValidPreAuthDraft` below — for whoever reaches OnboardingFlow
// without a completed pre-auth draft, so consent is never silently
// skipped.
const POST_PERSONA_STEPS = ['name', 'contacts', 'time', 'grace'] as const;
const FALLBACK_STEPS = ['consent', 'persona', 'name', 'contacts', 'time', 'grace'] as const;
type Step = (typeof FALLBACK_STEPS)[number];

const EMPTY_CONTACT: TrustedContact = { name: '', phone: '' };

type Props = {
  /**
   * What PreAuthOnboarding already collected, handed down through
   * AuthGate/Root once a session exists. `null`/`undefined`, or a
   * draft with `privacyAccepted: false`, means whoever's here didn't
   * (or couldn't) finish that flow — see `hasValidPreAuthDraft` below
   * for what that changes.
   */
  preAuthDraft?: PreAuthDraft | null;
  /**
   * Called once the draft has actually been applied (end of
   * handleFinish) — AuthGate clears it in response. Without this, a
   * restart from Settings (still the same signed-in session, so
   * AuthGate never re-mounts to reset its own state) would keep
   * handing this same, by-then-possibly-stale draft to every future
   * run of this wizard instead of re-asking, same as any other
   * already-onboarded person editing things afterward.
   */
  onPreAuthDraftConsumed?: () => void;
};

/**
 * A short, linear wizard — your name, your trusted contact(s), your
 * check-in time, your grace period — then straight into the real app.
 * Each step writes into local component state (`draft`), and only the
 * final step commits it to ProfileContext via completeOnboarding(). No
 * navigation library: a handful of screens with one "next/back"
 * relationship don't need one yet (see ARCHITECTURE.md).
 */
export function OnboardingFlow({ preAuthDraft, onPreAuthDraftConsumed }: Props) {
  const profile = useProfile();
  // The one thing this whole component branches on. A valid draft
  // means consent was already recorded and persona already answered
  // before sign-in — this wizard just continues from `name`. Anything
  // else (skipped straight to sign-in, or a draft that somehow never
  // got a "true" here) falls back to asking both again, right here,
  // rather than ever completing onboarding with unrecorded consent.
  const hasValidPreAuthDraft = preAuthDraft?.privacyAccepted === true;
  const STEPS: readonly Step[] = hasValidPreAuthDraft ? POST_PERSONA_STEPS : FALLBACK_STEPS;

  const [stepIndex, setStepIndex] = useState(0);
  const [consentDraft, setConsentDraft] = useState<boolean>(preAuthDraft?.privacyAccepted ?? profile.privacyAccepted);
  const [subjectModeDraft, setSubjectModeDraft] = useState<SubjectMode>(preAuthDraft?.subjectMode ?? profile.subjectMode);
  const [nameDraft, setNameDraft] = useState(profile.userName);
  const [contactsDraft, setContactsDraft] = useState<TrustedContact[]>(
    profile.contacts.length > 0 ? profile.contacts : [EMPTY_CONTACT]
  );
  const [timeDraft, setTimeDraft] = useState<CheckInWindow>(profile.checkInWindow);
  const [graceDraft, setGraceDraft] = useState<number>(profile.graceMinutes);
  // Set while the Privacy Policy or Terms is open mid-onboarding —
  // replaces the whole flow with LegalScreen rather than being a step
  // of its own, since "go read this" isn't a forward step in the
  // wizard the way the others are.
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | null>(null);

  const step: Step = STEPS[stepIndex];
  const entranceStyle = useEntranceStyle(step, { duration: 360 });

  const canContinueName = nameDraft.trim().length > 0;
  const canContinueContacts = contactsDraft.every(
    (contact) => contact.name.trim().length > 0 && contact.phone.trim().length > 0
  );

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleFinish = () => {
    if (consentDraft && !profile.privacyAccepted) profile.acceptPrivacyPolicy();
    profile.setSubjectMode(subjectModeDraft);
    profile.setUserName(nameDraft.trim());
    profile.setContacts(contactsDraft.map((c) => ({ name: c.name.trim(), phone: c.phone.trim() })));
    profile.setCheckInWindow(timeDraft);
    profile.setGraceMinutes(graceDraft);
    profile.completeOnboarding();
    onPreAuthDraftConsumed?.();
  };

  const primaryLabel = step === 'grace' ? 'Start using ALIVE' : 'Continue';

  const primaryDisabled =
    (step === 'consent' && !consentDraft) ||
    (step === 'name' && !canContinueName) ||
    (step === 'contacts' && !canContinueContacts);

  if (legalDoc) {
    return <LegalScreen doc={legalDoc} onBack={() => setLegalDoc(null)} />;
  }

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
            {stepIndex === 0 ? null : (
              <OnboardingHeader step={stepIndex - 1} totalSteps={STEPS.length - 1} onBack={goBack} />
            )}
          </View>

          <Animated.ScrollView
            style={[styles.content, entranceStyle]}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            // The time step nests its own vertical scroll wheels — a
            // vertical ScrollView scrolling inside another vertical
            // ScrollView is a well-known gesture fight (the outer one
            // tends to win the touch), which made the wheels feel
            // broken. That step's content is short and never needs
            // this outer scroll anyway, so it's simplest to just turn
            // it off there rather than fight the nested gesture.
            scrollEnabled={step !== 'time'}
          >
            {step === 'consent' && (
              <ConsentStep
                accepted={consentDraft}
                onChange={setConsentDraft}
                onOpenPrivacy={() => setLegalDoc('privacy')}
                onOpenTerms={() => setLegalDoc('terms')}
              />
            )}
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
