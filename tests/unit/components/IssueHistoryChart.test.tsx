import { render, screen } from '@testing-library/react';
import { IssueHistoryChart } from '../../../src/components/IssueHistoryChart/IssueHistoryChart';

it('shows empty state when no history exists', () => {
  render(<IssueHistoryChart metrics={[]} weeks={[]} />);
  expect(screen.getByText(/Issue history/i)).toBeInTheDocument();
});
