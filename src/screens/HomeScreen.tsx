import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AliveButton } from '../components/AliveButton';
import { CheckInSummary } from '../components/CheckInSummary';
import { DemoFooter } from '../components/DemoFooter';
import { StatusPreview } from '../components/StatusPreview';
import { Wordmark } from '../components/Wordmark';
import { useEntranceStyle } from '../hooks/useEntranceStyle';
import { useCheckIn } from '../state/CheckInContext';
import { useProfile } from '../state/ProfileContext';
import { colors, spacing, typography } from '../theme';
import { windowOption } from '../types/profile';
import { CheckInStatus, getCheckInStatus, previewTimeFor } from '../utils/checkInStatus';
import { joinNames } from '../utils/text';
import { formatDateLabel, formatHourLabel, formatTime, greetingForHour, nextCheckInLabel } from '../utils/time';

/**
 * How long the button lingers on its checkmark before the screen hands
 * off to the confirmed state. This is deliberately unhurried — the
 * whole point of this beat is to let "that worked" register before
 * anything else changes.
 */
const CHECKMARK_HOLD_MS = 1300;

type Phase = 'idle' | 'confirming' | 'confirmed';

export function HomeScreen() {
  const { userName, contacts, checkInWindow, restartOnboarding } = useProfile();
  const contactNames = joinNames(contacts.map((c) => c.name));
  const { lastCheckInAt, checkIn, reset } = useCheckIn();
  const window = windowOption(checkInWindow);

  const [phase, setPhase] = useState<Phase>(lastCheckInAt ? 'confirmed' : 'idle');
  // null = the real clock. Anything else previews what the screen looks
  // like at that point in the escalation timeline — see StatusPreview.
  const [previewStatus, setPreviewStatus] = useState<CheckInStatus | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, []);

  const handleCheckIn = () => {
    checkIn(); // Recorded immediately, so the timestamp reflects the actual tap.
    setPhase('confirming');
    holdTimer.current = setTimeout(() => setPhase('confirmed'), CHECKMARK_HOLD_MS);
  };

  const handleResetCheckIn = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    reset();
    setPhase('idle');
    setPreviewStatus(null);
  };

  const handleRestartOnboarding = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    reset();
    restartOnboarding();
  };

  const realNow = new Date();
  const now = previewStatus ? previewTimeFor(previewStatus, window, realNow) : realNow;
  const status = getCheckInStatus(now, window);

  const greeting = `${greetingForHour(now.getHours())}, ${userName}.`;
  const dateLabel = formatDateLabel(now);
  const showsConfirmedContent = phase === 'confirmed';

  // A quiet fade + rise for whichever content is on screen, replayed
  // whenever the confirmed state or the status changes — slow enough
  // that the change reads as considered rather than a jump cut.
  const entranceStyle = useEntranceStyle(showsConfirmedContent ? 'confirmed' : status, { duration: 450 });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Wordmark />
          <Animated.View style={[styles.textBlock, entranceStyle]}>
            <Text style={styles.eyebrow}>{dateLabel.toUpperCase()}</Text>
            {showsConfirmedContent ? (
              <>
                <Text style={styles.hero}>You're all set.</Text>
                <Text style={styles.subtext}>
                  {contactNames} will only hear from ALIVE if you ever miss a
                  check-in.
                </Text>
              </>
            ) : status === 'escalated' ? (
              <>
                <Text style={styles.hero}>{contactNames} have been notified.</Text>
                <Text style={styles.subtext}>
                  Check in now and we'll let them know you're okay.
                </Text>
              </>
            ) : status === 'missed' ? (
              <>
                <Text style={styles.hero}>We haven't heard from you.</Text>
                <Text style={styles.subtext}>
                  We'll let {contactNames} know if we don't hear from you soon.
                </Text>
              </>
            ) : status === 'closingSoon' ? (
              <>
                <Text style={styles.hero}>{greeting}</Text>
                <Text style={styles.subtext}>
                  Your window closes at {formatHourLabel(window.endHour)} — let{' '}
                  {contactNames} know you're okay.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.hero}>{greeting}</Text>
                <Text style={styles.subtext}>
                  Let {contactNames} know you're okay.
                </Text>
              </>
            )}
          </Animated.View>
        </View>

        <View style={styles.middle}>
          {showsConfirmedContent ? (
            <Animated.View style={[styles.summaryWrap, entranceStyle]}>
              <CheckInSummary
                rows={[
                  { label: 'Checked in today', value: formatTime(lastCheckInAt as Date) },
                  { label: 'Next check-in', value: nextCheckInLabel(checkInWindow) },
                ]}
              />
            </Animated.View>
          ) : (
            <AliveButton
              label="I'M ALIVE"
              onPress={handleCheckIn}
              confirmed={phase === 'confirming'}
            />
          )}
        </View>

        <View style={styles.bottom}>
          {phase === 'idle' ? (
            <StatusPreview activeStatus={previewStatus} onSelect={setPreviewStatus} />
          ) : null}
          <DemoFooter
            onResetCheckIn={showsConfirmedContent ? handleResetCheckIn : undefined}
            onRestartOnboarding={handleRestartOnboarding}
          />
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
  },
  textBlock: {
    marginTop: spacing.xxl,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.inkFaint,
    marginBottom: spacing.sm,
  },
  hero: {
    ...typography.hero,
    color: colors.ink,
  },
  subtext: {
    ...typography.body,
    color: colors.inkMuted,
    marginTop: spacing.sm,
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryWrap: {
    width: '100%',
  },
  bottom: {
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
});
