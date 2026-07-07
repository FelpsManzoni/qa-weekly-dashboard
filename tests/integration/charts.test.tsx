import { render, screen } from '@testing-library/react';
import { IssueHistoryChart } from '../../src/components/IssueHistoryChart/IssueHistoryChart';
import { TestCaseDistributionChart } from '../../src/components/TestCaseDistributionChart/TestCaseDistributionChart';

it('renders chart sections', () => {
  render(
    <>
      <IssueHistoryChart metrics={[{ id: 'i1', week_id: 'w1', project_id: 'p1', reported_count: 3, fixed_count: 1 }]} weeks={[{ id: 'w1', week_number: 27, start_date: '2026-06-29', end_date: '2026-07-05', is_active: true }]} />
      <TestCaseDistributionChart distributions={[{ id: 't1', week_id: 'w1', project_id: 'p1', automated_count: 2, pending_auto_count: 1, not_auto_count: 1 }]} />
    </>
  );
  expect(screen.getByText(/Issue history/i)).toBeInTheDocument();
  expect(screen.getByText(/Test case distribution/i)).toBeInTheDocument();
});
