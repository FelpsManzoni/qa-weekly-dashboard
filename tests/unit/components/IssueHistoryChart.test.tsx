import { render, screen } from '@testing-library/react';
import { IssueHistoryChart } from '../../../src/components/IssueHistoryChart/IssueHistoryChart';

it('shows empty state when no history exists', () => {
  render(<IssueHistoryChart metrics={[]} weeks={[]} />);
  expect(screen.getByText(/Issue history/i)).toBeInTheDocument();
});

it('renders history and highlights the selected week', () => {
  render(
    <IssueHistoryChart
      metrics={[
        { id: 'i1', week_id: 'w1', project_id: 'p1', reported_count: 3, fixed_count: 1 },
        { id: 'i2', week_id: 'w2', project_id: 'p1', reported_count: 5, fixed_count: 4 }
      ]}
      weeks={[
        { id: 'w1', week_number: 26, calendar_year: 2026, start_date: '2026-06-22', end_date: '2026-06-28', is_active: true },
        { id: 'w2', week_number: 27, calendar_year: 2026, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true }
      ]}
      selectedWeekId="w2"
    />
  );
  // The mocked recharts ReferenceLine renders when a selected week is present.
  expect(document.querySelector('[data-chart="reference-line"]')).toBeInTheDocument();
});
