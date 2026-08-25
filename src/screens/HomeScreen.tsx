import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AliveButton } from '../components/AliveButton';
import { CheckInSummary } from '../components/CheckInSummary';
import { DemoFooter } from '../components/DemoFooter';
import { Wordmark } from '../components/Wordmark';
import { useCheckIn } from '../state/CheckInContext';
import { colors, spacing, typography } from '../theme';
import { formatDateLabel, formatTime, greetingForHour, nextCheckInLabel } from '../utils/time';

export function HomeScreen() {
  const { userName, contactName, lastCheckInAt, checkIn, reset } = useCheckIn();
  const hasCheckedInToday = lastCheckInAt !== null;

  const now = new Date();
  const greeting = `${greetingForHour(now.getHours())}, ${userName}.`;
  const dateLabel = formatDateLabel(now);

  // A quiet fade + rise for whichever content is on screen, replayed
  // every time the checked-in state flips — this is what makes the
  // switch between "ask" and "confirmed" feel considered rather than
  // like a jump cut.
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    entrance.setValue(0);
    Animated.timing(entrance, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [hasCheckedInToday, entrance]);

  const entranceStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Wordmark />
          <Animated.View style={[styles.textBlock, entranceStyle]}>
            <Text style={styles.eyebrow}>{dateLabel.toUpperCase()}</Text>
            {hasCheckedInToday ? (
              <>
                <Text style={styles.hero}>You're all set.</Text>
                <Text style={styles.subtext}>
                  {contactName} will only hear from ALIVE if you ever miss a
                  check-in.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.hero}>{greeting}</Text>
                <Text style={styles.subtext}>
                  Let {contactName} know you're okay.
                </Text>
              </>
            )}
          </Animated.View>
        </View>

        <View style={styles.middle}>
          {hasCheckedInToday ? (
            <Animated.View style={[styles.summaryWrap, entranceStyle]}>
              <CheckInSummary
                rows={[
                  { label: 'Checked in today', value: formatTime(lastCheckInAt as Date) },
                  { label: 'Next check-in', value: nextCheckInLabel() },
                ]}
              />
            </Animated.View>
          ) : (
            <AliveButton label="I'M ALIVE" onPress={checkIn} />
          )}
        </View>

        <View style={styles.bottom}>
          <DemoFooter onReset={hasCheckedInToday ? reset : undefined} />
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
