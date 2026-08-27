import { CheckInWindow, ESCALATION } from '../types/profile';

export type CheckInStatus = 'open' | 'closingSoon' | 'missed' | 'escalated';

/** `hour:minute`, plus `minuteOffset` minutes (may be negative), on the same calendar day as `base`. */
function timeAt(base: Date, hour: number, minute: number, minuteOffset = 0): Date {
  const d = new Date(base);
  d.setHours(hour, minute + minuteOffset, 0, 0);
  return d;
}

/**
 * Where things stand today, purely as a function of the clock, the
 * chosen check-in deadline, and the user's own grace period — no demo
 * trickery here. A reminder fires 30 minutes before the deadline;
 * missing the deadline itself starts the grace period the user chose
 * during onboarding, and only once that runs out are contacts told.
 *
 * Only meaningful when the user hasn't checked in yet today — once
 * they have, HomeScreen shows the confirmed state instead and never
 * calls this.
 */
export function getCheckInStatus(now: Date, window: CheckInWindow, graceMinutes: number): CheckInStatus {
  const closingSoonStart = timeAt(now, window.hour, window.minute, -ESCALATION.reminderBeforeCloseMin);
  const deadline = timeAt(now, window.hour, window.minute);
  const escalatedStart = timeAt(now, window.hour, window.minute, graceMinutes);

  if (now < closingSoonStart) return 'open';
  if (now < deadline) return 'closingSoon';
  if (now < escalatedStart) return 'missed';
  return 'escalated';
}

/**
 * A representative "now" for each status, relative to today's deadline
 * — used only by the demo status preview, since nobody wants to wait a
 * real grace period to see what "escalated" looks like.
 */
export function previewTimeFor(
  status: CheckInStatus,
  window: CheckInWindow,
  graceMinutes: number,
  base: Date
): Date {
  switch (status) {
    case 'open':
      return timeAt(base, window.hour, window.minute, -ESCALATION.reminderBeforeCloseMin - 60);
    case 'closingSoon':
      return timeAt(base, window.hour, window.minute, -15);
    case 'missed':
      return timeAt(base, window.hour, window.minute, 15);
    case 'escalated':
      return timeAt(base, window.hour, window.minute, graceMinutes + 5);
  }
}
