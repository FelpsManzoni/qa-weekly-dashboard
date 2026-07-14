import { render, screen } from '@testing-library/react';
import { TestCaseDistributionChart } from '../../../src/components/TestCaseDistributionChart/TestCaseDistributionChart';

it('shows empty state when no distribution exists', () => {
  render(<TestCaseDistributionChart distributions={[]} />);
  expect(screen.getByText(/Test case distribution/i)).toBeInTheDocument();
});

it('renders a side legend with values when data exists', () => {
  render(
    <TestCaseDistributionChart
      distributions={[
        { id: 't1', week_id: 'w1', project_id: 'p1', automated_count: 20, pending_auto_count: 5, not_auto_count: 10 }
      ]}
    />
  );

  expect(screen.getByLabelText(/Test case distribution legend/i)).toBeInTheDocument();
  expect(screen.getByText('Automated')).toBeInTheDocument();
  expect(screen.getByText('20')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(screen.getByText('10')).toBeInTheDocument();
});
