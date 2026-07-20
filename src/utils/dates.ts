import type { Week, WeekDraft } from '../types';

const DAY_MS = 86_400_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

function formatIsoDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfIsoWeek(date: Date): Date {
  const normalized = startOfUtcDay(date);
  const isoDay = (normalized.getUTCDay() + 6) % 7;
  return addUtcDays(normalized, -isoDay);
}

export function isoWeekInfo(date: Date): Omit<Week, 'id'> {
  const weekStart = startOfIsoWeek(date);
  const weekEnd = addUtcDays(weekStart, 6);
  const thursday = addUtcDays(weekStart, 3);
  const calendarYear = thursday.getUTCFullYear();
  const firstWeekStart = startOfIsoWeek(new Date(Date.UTC(calendarYear, 0, 4)));
  const weekNumber = Math.floor((weekStart.getTime() - firstWeekStart.getTime()) / DAY_MS / 7) + 1;

  return {
    week_number: weekNumber,
    calendar_year: calendarYear,
    start_date: formatIsoDate(weekStart),
    end_date: formatIsoDate(weekEnd),
    is_active: true
  };
}

export function recentProjectDataWeeks(existingWeeks: Week[], now = new Date()): WeekDraft[] {
  const persistedByStart = new Map(existingWeeks.map((week) => [week.start_date, week]));
  const threeMonthsAgo = startOfUtcDay(now);
  threeMonthsAgo.setUTCMonth(threeMonthsAgo.getUTCMonth() - 3);

  const earliestWeekStart = startOfIsoWeek(threeMonthsAgo);
  const currentWeekStart = startOfIsoWeek(now);
  const weeks: WeekDraft[] = [];

  for (let cursor = currentWeekStart; cursor.getTime() >= earliestWeekStart.getTime(); cursor = addUtcDays(cursor, -7)) {
    const generated = isoWeekInfo(cursor);
    const persisted = persistedByStart.get(generated.start_date);
    weeks.push(persisted ? { ...persisted } : { id: null, ...generated });
  }

  return weeks;
}

function parseDateInput(date: string): Date {
  if (ISO_DATE.test(date)) {
    return new Date(`${date}T00:00:00Z`);
  }
  return new Date(date);
}

export function formatDate(date: string): string {
  const parsed = parseDateInput(date);

  return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC' }).format(parsed);
}

// dd/mm/yyyy with zero-padding, used for release dates in the spec.
export function formatDateBr(date: string): string {
  const parsed = parseDateInput(date);
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const year = parsed.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export function formatWeekRange(week: Pick<Week, 'start_date' | 'end_date'>): string {
  return `${formatDate(week.start_date)} - ${formatDate(week.end_date)}`;
}

export function weekLabel(week: Pick<Week, 'week_number'>): string {
  return `Week ${week.week_number}`;
}

export function isoWeekLabel(week: Pick<Week, 'calendar_year' | 'week_number'>): string {
  return `${week.calendar_year}-W${String(week.week_number).padStart(2, '0')}`;
}

export function isLockExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}

export function futureTimestamp(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}
