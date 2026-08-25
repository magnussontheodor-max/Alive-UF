import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AliveButton } from '../components/AliveButton';
import { CheckInSummary } from '../components/CheckInSummary';
import { DemoFooter } from '../components/DemoFooter';
import { Wordmark } from '../components/Wordmark';
import { useEntranceStyle } from '../hooks/useEntranceStyle';
import { useCheckIn } from '../state/CheckInContext';
import { useProfile } from '../state/ProfileContext';
import { colors, spacing, typography } from '../theme';
import { formatDateLabel, formatTime, greetingForHour, nextCheckInLabel } from '../utils/time';
import { joinNames } from '../utils/text';

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

  const [phase, setPhase] = useState<Phase>(lastCheckInAt ? 'confirmed' : 'idle');
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
  };

  const handleRestartOnboarding = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    reset();
    restartOnboarding();
  };

  const now = new Date();
  const greeting = `${greetingForHour(now.getHours())}, ${userName}.`;
  const dateLabel = formatDateLabel(now);
  const showsConfirmedContent = phase === 'confirmed';

  // A quiet fade + rise for whichever content is on screen, replayed
  // whenever the confirmed state is entered or left — slow enough that
  // the change reads as considered rather than a jump cut.
  const entranceStyle = useEntranceStyle(showsConfirmedContent, { duration: 450 });

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
  },
});
