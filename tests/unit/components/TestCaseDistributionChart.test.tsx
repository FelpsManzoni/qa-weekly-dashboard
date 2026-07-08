import { render, screen } from '@testing-library/react';
import { TestCaseDistributionChart } from '../../../src/components/TestCaseDistributionChart/TestCaseDistributionChart';

it('shows empty state when no distribution exists', () => {
  render(<TestCaseDistributionChart distributions={[]} />);
  expect(screen.getByText(/Test case distribution/i)).toBeInTheDocument();
});
