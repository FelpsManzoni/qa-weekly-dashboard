import { requireNonNegative, validateWeek, validateProject, validateNote } from '../../../src/utils/validation';

it('requireNonNegative flags negatives only', () => {
  expect(requireNonNegative(-1, 'X')).toMatch(/zero or greater/);
  expect(requireNonNegative(0, 'X')).toBeNull();
});

it('validateWeek enforces range and date order', () => {
  expect(validateWeek({ week_number: 0, start_date: '2026-01-01', end_date: '2026-01-08' })).toMatch(/between 1 and 53/);
  expect(validateWeek({ week_number: 54, start_date: '2026-01-01', end_date: '2026-01-08' })).toMatch(/between 1 and 53/);
  expect(validateWeek({ week_number: 5, start_date: '2026-01-08', end_date: '2026-01-01' })).toMatch(/after start date/);
  expect(validateWeek({ week_number: 5, start_date: '2026-01-01', end_date: '2026-01-08' })).toBeNull();
});

it('validateProject enforces code format and name', () => {
  expect(validateProject({ code: 'lower', name: 'x' })).toMatch(/uppercase alphanumeric/);
  expect(validateProject({ code: 'HAM', name: '  ' })).toMatch(/name is required/);
  expect(validateProject({ code: 'HAM', name: 'Harman' })).toBeNull();
});

it('validateNote enforces priority and text', () => {
  expect(validateNote({ priority: 5 as 0, note_text: 'x' })).toMatch(/Priority must be/);
  expect(validateNote({ priority: 1, note_text: '   ' })).toMatch(/text is required/);
  expect(validateNote({ priority: 1, note_text: 'ok' })).toBeNull();
});
