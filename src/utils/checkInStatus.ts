import { CheckInWindowOption, ESCALATION } from '../types/profile';

export type CheckInStatus = 'open' | 'closingSoon' | 'missed' | 'escalated';

/** `hour`, plus `minuteOffset` minutes (may be negative), on the same calendar day as `base`. */
function timeAt(base: Date, hour: number, minuteOffset = 0): Date {
  const d = new Date(base);
  d.setHours(hour, minuteOffset, 0, 0);
  return d;
}

/**
 * Where things stand today, purely as a function of the clock and the
 * chosen window — no demo trickery here. The escalation timeline
 * (ESCALATION, in types/profile.ts) is what turns "the window closed"
 * into "closing soon" / "missed" / "escalated": a reminder 30 minutes
 * before close, another 30 after, contacts informed 30 after that.
 *
 * Only meaningful when the user hasn't checked in yet today — once
 * they have, HomeScreen shows the confirmed state instead and never
 * calls this.
 */
export function getCheckInStatus(now: Date, window: CheckInWindowOption): CheckInStatus {
  const closingSoonStart = timeAt(now, window.endHour, -ESCALATION.reminderBeforeCloseMin);
  const windowEnd = timeAt(now, window.endHour);
  const escalatedStart = timeAt(now, window.endHour, ESCALATION.escalateAfterCloseMin);

  if (now < closingSoonStart) return 'open';
  if (now < windowEnd) return 'closingSoon';
  if (now < escalatedStart) return 'missed';
  return 'escalated';
}

/**
 * A representative "now" for each status, relative to today's window —
 * used only by the demo status preview, since nobody wants to wait a
 * real hour to see what "escalated" looks like.
 */
export function previewTimeFor(status: CheckInStatus, window: CheckInWindowOption, base: Date): Date {
  switch (status) {
    case 'open':
      return timeAt(base, window.startHour, 0);
    case 'closingSoon':
      return timeAt(base, window.endHour, -15);
    case 'missed':
      return timeAt(base, window.endHour, 15);
    case 'escalated':
      return timeAt(base, window.endHour, ESCALATION.escalateAfterCloseMin + 5);
  }
}
