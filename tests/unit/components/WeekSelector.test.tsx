import { fireEvent, render, screen } from '@testing-library/react';
import { WeekSelector } from '../../../src/components/WeekSelector/WeekSelector';

const weeks = [
  { id: 'w1', week_number: 27, calendar_year: 2026, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true }
];

it('renders weeks and supports selection', () => {
  const onSelect = vi.fn();
  render(<WeekSelector weeks={weeks} selectedWeekId={null} onSelect={onSelect} />);

  fireEvent.click(screen.getByRole('button', { name: /Week 27/i }));
  expect(onSelect).toHaveBeenCalledWith('w1');
});
