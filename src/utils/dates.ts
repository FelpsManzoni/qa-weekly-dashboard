import type { Week } from '../types';

export function formatDate(date: string): string {
  const parsed = new Date(date);

  return new Intl.DateTimeFormat('en-GB').format(parsed);
}

export function formatWeekRange(week: Week): string {
  return `${formatDate(week.start_date)} - ${formatDate(week.end_date)}`;
}

export function weekLabel(week: Week): string {
  return `Week ${week.week_number}`;
}

export function isLockExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}

export function futureTimestamp(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}
