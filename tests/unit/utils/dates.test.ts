import { formatDate, formatWeekRange } from '../../../src/utils/dates';

it('formats ISO dates without timezone shifts', () => {
  expect(formatDate('2026-06-29')).toBe('29/06/2026');
  expect(formatDate('2026-07-05')).toBe('05/07/2026');
});

it('formats ISO week ranges as Monday through Sunday', () => {
  expect(
    formatWeekRange({
      start_date: '2026-06-29',
      end_date: '2026-07-05'
    })
  ).toBe('29/06/2026 - 05/07/2026');
});
