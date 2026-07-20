import type { PriorityNote, Project, Week } from '../types';

export function requireNonNegative(value: number, label: string): string | null {
  if (value < 0) {
    return `${label} must be zero or greater.`;
  }

  return null;
}

export function validateWeek(values: Pick<Week, 'week_number' | 'calendar_year' | 'start_date' | 'end_date'>): string | null {
  if (values.week_number < 1 || values.week_number > 53) {
    return 'Week number must be between 1 and 53.';
  }

  if (new Date(values.end_date) <= new Date(values.start_date)) {
    return 'End date must be after start date.';
  }

  return null;
}

export function validateProject(values: Pick<Project, 'code' | 'name'>): string | null {
  if (!/^[A-Z0-9]+$/.test(values.code)) {
    return 'Project code must be uppercase alphanumeric.';
  }

  if (!values.name.trim()) {
    return 'Project name is required.';
  }

  return null;
}

export function validateNote(note: Pick<PriorityNote, 'priority' | 'note_text'>): string | null {
  if (![0, 1, 2, 3].includes(note.priority)) {
    return 'Priority must be 0, 1, 2, or 3.';
  }

  if (!note.note_text.trim()) {
    return 'Note text is required.';
  }

  return null;
}
