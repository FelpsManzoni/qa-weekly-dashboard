import { render, screen } from '@testing-library/react';
import { IssueHistoryChart } from '../../../src/components/IssueHistoryChart/IssueHistoryChart';

function chartProps(name: string) {
  const node = document.querySelector(`[data-chart="${name}"]`);
  expect(node).toBeInTheDocument();
  return JSON.parse(node?.getAttribute('data-props') ?? '{}');
}

it('shows empty state when no history exists', () => {
  render(<IssueHistoryChart metrics={[]} weeks={[]} rangeWeeks={5} onRangeChange={vi.fn()} />);
  expect(screen.getAllByText(/Issue history/i)).toHaveLength(2);
  expect(screen.getByRole('button', { name: /Last 5 weeks/i })).toBeInTheDocument();
});

it('renders history and highlights the selected week', () => {
  const onRangeChange = vi.fn();
  render(
    <IssueHistoryChart
      metrics={[
        { id: 'i1', week_id: 'w1', project_id: 'p1', reported_count: 100, fixed_count: 80 },
        { id: 'i2', week_id: 'w2', project_id: 'p1', reported_count: 110, fixed_count: 95 }
      ]}
      weeks={[
        { id: 'w1', week_number: 26, calendar_year: 2026, start_date: '2026-06-22', end_date: '2026-06-28', is_active: true },
        { id: 'w2', week_number: 27, calendar_year: 2026, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true }
      ]}
      selectedWeekId="w2"
      rangeWeeks={5}
      onRangeChange={onRangeChange}
    />
  );
  // The mocked recharts ReferenceLine renders when a selected week is present.
  expect(document.querySelector('[data-chart="reference-line"]')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Last 10 weeks/i })).toBeInTheDocument();
  expect(chartProps('y-axis').domain).toEqual([77, 113]);
});
